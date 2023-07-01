import awsLambdaFastify from '@fastify/aws-lambda';
import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { createApp } from './app';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await createApp();
  await app.init();

  const fastifyInstance = app.getHttpAdapter().getInstance();
  // @ts-ignore https://github.com/fastify/aws-lambda-fastify
  return awsLambdaFastify(fastifyInstance);
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  cachedServer = cachedServer ?? (await bootstrap());
  return cachedServer(event, context, callback);
};
