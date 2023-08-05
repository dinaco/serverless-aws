import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'path';

export class Lambdas extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk.aws_lambda_nodejs.NodejsFunction(this, 'LambdaTests', {
      entry: path.join(__dirname, 'LambdaTests', 'handler.ts'),
      handler: 'handler',
    });

  }
}
