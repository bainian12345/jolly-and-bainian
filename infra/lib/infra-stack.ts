import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Database } from './database';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const database = new Database(this, 'JollyAndBainianDatabase');
    const bucket = new s3.Bucket(this, 'JollyAndBainianBucket', {
      bucketName: 'jolly-and-bainian-bucket',
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      publicReadAccess: true,
      versioned: false,
    });
  }
}
