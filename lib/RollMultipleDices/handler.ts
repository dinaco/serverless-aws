type LambdaInput = { pathParameters: { amountDices: string } };

export const handler = async ({
  pathParameters: { amountDices },
}: LambdaInput): Promise<{ statusCode: number; body?: number }> => {
  if (Number.isNaN(+amountDices)) {
    return Promise.resolve({ statusCode: 400 });
  }

  let total = 0;

  for (let i = 0; i < +amountDices; i++) {
    total += Math.floor(Math.random() * 6) + 1;
  }

  return Promise.resolve({ statusCode: 200, body: total });
};
