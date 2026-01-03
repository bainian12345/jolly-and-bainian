import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Stack } from 'aws-cdk-lib';

export class EmailSender extends Construct {
  stack: Stack;
  sqsQueue: sqs.Queue;
  lambdaFunction: lambda.Function;

  constructor(stack: Stack, id: string, bucket: s3.Bucket) {
    super(stack, id);
    this.stack = stack;
    this.sqsQueue = this.createSqsQueue();
    this.lambdaFunction = this.createLambdaFunction(this.sqsQueue, bucket);
  }

  createSqsQueue() {
    const emailDlq = new sqs.Queue(this, 'EmailSenderDlq', {
      queueName: 'EmailSenderDlq',
      retentionPeriod: cdk.Duration.days(7),
    });

    const emailQueue = new sqs.Queue(this, 'EmailSenderQueue', {
      queueName: 'EmailSenderQueue',
      retentionPeriod: cdk.Duration.days(3),
      deadLetterQueue: {
        queue: emailDlq,
        maxReceiveCount: 3,
      }
    });

    new cdk.CfnOutput(this, 'EmailQueueURL', {
      value: emailQueue.queueUrl,
    });
    return emailQueue;
  }

  createLambdaFunction(intakeQueue: sqs.Queue, bucket: s3.Bucket) {
    const emailLambda = new lambda.Function(this, 'EmailLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler.handler',
      code: lambda.Code.fromBucket(bucket, 'lambdas/emailSender.zip'),
      timeout: cdk.Duration.seconds(15),
      memorySize: 256,
      functionName: 'JollyAndBainianEmailSender',
    });

    intakeQueue.grantConsumeMessages(emailLambda);
    emailLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
      })
    );

    emailLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(intakeQueue, {
        batchSize: 5,
      })
    );

    return emailLambda;
  }
}
