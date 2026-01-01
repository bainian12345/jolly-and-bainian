import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export class Database extends Construct {
  stack: Stack;
  database: rds.DatabaseInstance;

  constructor(stack: Stack, id: string) {
    super(stack, id);
    this.stack = stack;
    const defaultVPC = ec2.Vpc.fromLookup(this, 'DefaultVPC', { isDefault: true });
    const securityGroup = this.createSecurityGroup(defaultVPC);
    this.database = this.createDatabase(defaultVPC, securityGroup);
  }

  createSecurityGroup(vpc: ec2.IVpc) {
    const securityGroup = new ec2.SecurityGroup(this, 'JollyAndBainianSecurityGroup', {
      vpc,
      description: 'Security group for Jolly and Bainian database, should allow service to access the database',
      allowAllOutbound: true,
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432), 'Allow public access to database');
    return securityGroup;
  }

  createDatabase(vpc: ec2.IVpc, securityGroup: ec2.SecurityGroup) {
    const dbPassword = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'database_password', { parameterName: 'database_password' }).stringValue;
    // const dbPassword = ssm.StringParameter.valueForStringParameter(this, 'database_password');
    return new rds.DatabaseInstance(this, 'JollyAndBainianDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_18 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      securityGroups: [securityGroup],
      publiclyAccessible: true,
      storageEncrypted: true,
      allocatedStorage: 20,
      maxAllocatedStorage: 20,
      databaseName: 'jollyandbainian',
      multiAz: false,
      credentials: rds.Credentials.fromPassword('postgres', cdk.SecretValue.unsafePlainText(dbPassword)),
      instanceIdentifier: 'jollyandbainian',
    });
  }
}