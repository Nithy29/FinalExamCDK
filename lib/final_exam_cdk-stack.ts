import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';



export class FinalExamCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  
  const vpc = new ec2.Vpc(this, 'SarvanVPC', {
        cidr: '10.30.0.0/16',
        vpcName: 'SarvanVPC',
  });
  
  
  // Create a public subnet
  const publicSubnet = vpc.publicSubnets[0];
    
    
  // Create an EC2 instance in the public subnet
  const ec2Instance = new ec2.Instance(this, 'MyEC2Instance', {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    machineImage: ec2.MachineImage.latestAmazonLinux(),
    vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC},
  });
  
  
  // Create an SQS queue
  const queue = new sqs.Queue(this, 'MyQueue', {
    visibilityTimeout: cdk.Duration.seconds(300),
  });
  
  
  // Create an SNS topic
  const topic = new sns.Topic(this, 'MyTopic');  


  // Create an AWS Secrets Manager secret
  const secret = new secretsmanager.Secret(this, 'MySecret', {
    secretName: 'metrodb-secrets',
    generateSecretString: {
      secretStringTemplate: JSON.stringify({
        username: 'admin',
      }),
      excludePunctuation: true,
      includeSpace: false,
      generateStringKey: 'metro1234',
    },
  });
  

  }
}
