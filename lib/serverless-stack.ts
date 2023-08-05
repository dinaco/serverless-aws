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

export class RollingDice extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const rollingDiceApi = new cdk.aws_apigateway.RestApi(
      this,
      'RollingDiceApi',
      {}
    );

    //----------------------- roll a dice ------------

    const rollADiceFunction = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      'rollADiceFunction',
      {
        entry: path.join(__dirname, 'RollADice', 'handler.ts'),
        handler: 'handler',
      }
    );

    // this specifies the endpoint name
    const diceResource = rollingDiceApi.root.addResource('dice');

    diceResource.addMethod(
      'GET',
      new cdk.aws_apigateway.LambdaIntegration(rollADiceFunction)
    );

    //----------------------- roll multiple dices ------------

    const rollMultipleDicesFunction = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      'rollMultipleDicesFunction',
      {
        entry: path.join(__dirname, 'RollMultipleDices', 'handler.ts'),
        handler: 'handler',
      }
    );

    const amountDices = diceResource.addResource('{amountDices}');

    amountDices.addMethod(
      'GET',
      new cdk.aws_apigateway.LambdaIntegration(rollMultipleDicesFunction)
    );
  }
}
