import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib/core';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Network } from "./network";

export class Service extends Construct {
  ecr: ecr.Repository;
  taskDefinition: ecs.TaskDefinition;
  service: ecs.Ec2Service;
  stack: Stack;

  constructor(stack: Stack, id: string, network: Network) {
    super(stack, id);
    this.stack = stack;
    this.ecr = this.createECR(stack);
    this.taskDefinition = this.createTaskDefinition();
    this.service = this.createService(this.taskDefinition, network);
  }

  createECR(stack: Stack) {
    return new ecr.Repository(stack, 'JollyAndBainianECR', {
      repositoryName: 'jolly-and-bainian-ecr',
      imageScanOnPush: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [
        {
          maxImageCount: 3,
          rulePriority: 1,
          description: "Keep only last 3 images for cost control",
        },
      ],
    });
  }

  createTaskDefinition() {
    const taskDefinition = new ecs.Ec2TaskDefinition(this.stack, 'TaskDef');
    const container = taskDefinition.addContainer('JollyAndBainianContainer', {
      image: ecs.ContainerImage.fromEcrRepository(this.ecr, 'latest'),
      memoryLimitMiB: 512,
      cpu: 256,
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'free-tier' }),
    });
    container.addPortMappings({
      containerPort: 80, // your app port
    });
    taskDefinition.defaultContainer = container;
    return taskDefinition;
  }

  createService(taskDefinition: ecs.TaskDefinition, network: Network) {
    const cluster = new ecs.Cluster(this.stack, 'JollyAndBainianCluster', {
      vpc: network.vpc,
      clusterName: 'jolly-and-bainian-cluster',
    });

    // const asg = cluster.addCapacity('DefaultAutoScalingGroup', {
    //   instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
    //   minCapacity: 1,
    //   maxCapacity: 1, // stay within free tier
    //   machineImage: ecs.EcsOptimizedImage.amazonLinux2(), // ECS optimized AMI
    // });

    const ec2Instance = new ec2.Instance(this, 'FreeTierInstance', {
      vpc: network.vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      associatePublicIpAddress: true,
    });

    // Associate Elastic IP with the instance
    new ec2.CfnEIPAssociation(this, 'EIPAssoc', {
      allocationId: network.elasticIp.attrAllocationId,
      instanceId: ec2Instance.instanceId, // CDK L1 requires this workaround
    });
    cluster.addCapacity('SingleInstance', { instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO), maxCapacity: 1 });

    const service = new ecs.Ec2Service(this, 'JollyAndBainianService', {
      cluster,
      taskDefinition,
      desiredCount: 1, // only one container to stay free
    });

    // Allow public HTTP traffic to container port
    service.connections.allowFromAnyIpv4(ec2.Port.tcp(80));
    return service;
  }
}