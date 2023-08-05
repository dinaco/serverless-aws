import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

/* export class SQS extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'ServerlessAwsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
} */

export class Lambdas extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk.aws_lambda_nodejs.NodejsFunction(this, 'LambdaTests', {
      entry: path.join(__dirname, 'LambdaTests', 'handler.ts'),
      handler: 'handler',
    });
  }
}
