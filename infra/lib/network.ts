import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';

export class Network extends Construct {
  stack: Stack;
  vpc: ec2.Vpc;
  elasticIp: ec2.CfnEIP;
  record: route53.ARecord;

  constructor(stack: Stack, id: string) {
    super(stack, id);
    this.stack = stack;
    this.vpc = this.createVPC();
    this.elasticIp = new ec2.CfnEIP(this, 'JollyAndBainianElasticIp');
    this.record = this.createRecord(this.elasticIp);
  }

  createVPC() {
    return new ec2.Vpc(this, 'FreeTierVPC', {
      maxAzs: 2,
      natGateways: 0, // free-tier friendly
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });
  }

  createRecord(elasticIp: ec2.CfnEIP) {
    const zone = route53.HostedZone.fromLookup(this, 'Zone', {
      domainName: 'jolly-and-bainian.click',
    });

    return new route53.ARecord(this, 'ARecord', {
      zone,
      target: route53.RecordTarget.fromIpAddresses(elasticIp.ref), // point to Elastic IP
    });
  }
}