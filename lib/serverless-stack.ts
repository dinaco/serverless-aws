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

export class DinacoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const DinacoApi = new cdk.aws_apigateway.RestApi(this, 'DinacoApi', {});

    //----------------------- roll a dice ------------

    const rollADiceFunction = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      'rollADiceFunction',
      {
        entry: path.join(__dirname, 'Dice/RollADice', 'handler.ts'),
        handler: 'handler',
      }
    );

    // this specifies the endpoint name
    const diceResource = DinacoApi.root.addResource('dice');

    diceResource.addMethod(
      'GET',
      new cdk.aws_apigateway.LambdaIntegration(rollADiceFunction)
    );

    //----------------------- roll multiple dices ------------

    const rollMultipleDicesFunction = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      'rollMultipleDicesFunction',
      {
        entry: path.join(__dirname, 'Dice/RollMultipleDices', 'handler.ts'),
        handler: 'handler',
      }
    );

    const amountDices = diceResource.addResource('{amountDices}');

    amountDices.addMethod(
      'GET',
      new cdk.aws_apigateway.LambdaIntegration(rollMultipleDicesFunction)
    );

    // ------------- DynamoTable ----------

    const notesDb = new cdk.aws_dynamodb.Table(this, 'notesDb', {
      partitionKey: {
        name: 'PK',
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // ------------------------------ Lambdas for dynamo table ---------

    const createNote = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      'createNote',
      {
        entry: path.join(__dirname, 'Notes/CreateNote', 'handler.ts'),
        handler: 'handler',
        environment: {
          TABLE_NAME: notesDb.tableName, // VERY IMPORTANT
        },
      }
    );

    notesDb.grantWriteData(createNote); // VERY IMPORTANT

    const getNote = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'getNote', {
      entry: path.join(__dirname, 'Notes/GetNote', 'handler.ts'),
      handler: 'handler',
      environment: {
        TABLE_NAME: notesDb.tableName, // VERY IMPORTANT
      },
    });

    notesDb.grantReadData(getNote); // VERY IMPORTANT

    const usersResource = DinacoApi.root
      .addResource('users')
      .addResource('{userId}');
    const notesResource = usersResource.addResource('notes');
    notesResource.addMethod(
      'POST',
      new cdk.aws_apigateway.LambdaIntegration(createNote)
    );
    notesResource
      .addResource('{id}')
      .addMethod('GET', new cdk.aws_apigateway.LambdaIntegration(getNote));
  }
}
