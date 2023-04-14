import helmet from '@fastify/helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import hbs from 'handlebars';
import { join, resolve } from 'path';
import { LogService } from 'src/services';
import { AppModule } from './app.module';
import { Configs } from './configs';

function setVersioning(app: NestFastifyApplication) {
  app.enableVersioning({
    type: VersioningType.URI,
  });
}

function setValidation(app: NestFastifyApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeUnsetFields: false,
      },
    }),
  );
}

function setSwagger(app: NestFastifyApplication, configService: ConfigService<Configs, true>) {
  const baseUrl = configService.get('baseUrl');
  const swaggerJson = `${baseUrl}/docs-json?token=Secure_2023`;
  // https://docs.nestjs.com/openapi/introduction
  const config = new DocumentBuilder()
    .setTitle('Demo API Service')
    .setDescription(
      `<p>Source code: <a href="https://github.com/ianzone/lambda-nestify" target="_blank">https://github.com/ianzone/lambda-nestify</a></p>
      <p>Endpoint base url: <b>${baseUrl}</b><p>
      <p>Import swagger JSON from <a href="${swaggerJson}" target="_blank">${swaggerJson}</a></p>`,
    )
    .addServer(configService.get('basePath'))
    .addBearerAuth({
      // https://docs.nestjs.com/openapi/security#bearer-authentication
      type: 'http',
      description: 'Please enter your Cognito accessToken',
    })
    .setVersion('0.0.0')
    .addTag(
      'Tenants',
      `this is for internal use, the bearer token is static, data stored in DynamoDB <b>${configService.get(
        'tenantsTable',
      )}</b>`,
    )
    .addTag('Users', `nylas users, stored in DynamoDB <b>${configService.get('usersTable')}</b>`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
  SwaggerModule.setup('/docs', app, document, {});
}

function setHBS(app: NestFastifyApplication) {
  const dir = resolve();
  app.useStaticAssets({
    root: [join(dir, 'public'), join(dir, 'node_modules', 'swagger-ui-dist')],
    prefix: '/public/',
  });
  app.setViewEngine({
    engine: {
      handlebars: hbs,
    },
    templates: join(dir, 'views'),
  });
}

export async function createApp() {
  const useCustomerLogger = process.env.NODE_ENV === 'dev' ? false : true;

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    cors: true,
    logger: useCustomerLogger ? false : undefined,
  });

  const configService = app.get(ConfigService);

  if (useCustomerLogger) {
    app.useLogger(app.get(LogService));
  }

  await app.register(helmet, { contentSecurityPolicy: false });

  setHBS(app);
  setVersioning(app);
  setValidation(app);
  setSwagger(app, configService);
  return app;
}
