import { Construct } from 'constructs';
import { Service } from './service';
import * as cdk from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Network } from './network';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const network = new Network(this, 'JollyAndBainianNetwork');
    const service = new Service(this, 'JollyAndBainianService', network);

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
