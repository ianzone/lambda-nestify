import helmet from '@fastify/helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  const baseUrl = configService.get<string>('baseUrl');
  const swaggerJson = `${baseUrl}/docs-json?token=${configService.get('token')}`;
  // https://docs.nestjs.com/openapi/introduction
  const config = new DocumentBuilder()
    .setTitle('Demo API Service')
    .setDescription(
      `<p>Source code: <a href="https://github.com/ianzone/lambda-nestify" target="_blank">https://github.com/ianzone/lambda-nestify</a></p>
      <p>Endpoint base url: <b>${baseUrl}</b><p>
      <p>Import Swagger JSON with Basic Auth from <a href="${swaggerJson}" target="_blank">${swaggerJson}</a></p>`,
    )
    .addServer(configService.get('basePath'))
    .addBearerAuth({
      // https://docs.nestjs.com/openapi/security#bearer-authentication
      type: 'http',
      description: 'Please enter your Cognito accessToken',
    })
    .addOAuth2({
      type: 'oauth2',
      flows: {
        implicit: {
          scopes: {
            openid: 'openid',
            email: 'email',
            phone: 'phone',
            profile: 'profile',
            'aws.cognito.signin.user.admin': 'aws.cognito.signin.user.admin',
          },
          authorizationUrl: `https://internal-user.auth.us-east-1.amazoncognito.com/login`,
        },
      },
    })
    .setVersion('0.0.0')
    .addTag('Resources', 'Business logic endpoints')
    .addTag(
      'Tenants',
      `For internal use, using static bearer token, data are stored in DynamoDB <b>${configService.get(
        'tenantsTable',
      )}</b>`,
    )
    .addTag('Users', `Service users, stored in DynamoDB <b>${configService.get('usersTable')}</b>`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
  SwaggerModule.setup('/docs', app, document, {
    customSiteTitle: 'App API',
    swaggerOptions: {
      persistAuthorization: true,
      oauth2RedirectUrl: `${baseUrl}/docs/oauth2-redirect.html`,
      initOAuth: {
        clientId: '1khs1nnmo2faioic9a4tm8hvst',
        scopes: ['openid', 'email', 'phone', 'profile', 'aws.cognito.signin.user.admin'],
      },
    },
  });
}

// function setAssets(app: NestFastifyApplication) {
//   const dir = resolve();
//   app.useStaticAssets({
//     root: join(dir, 'public'),
//     prefix: '/public/',
//   });
// }

// require @fastify/view
// function setViews(app: NestFastifyApplication) {
//   const dir = resolve();
//   app.setViewEngine({
//     engine: {
//       handlebars: hbs,
//     },
//     templates: join(dir, 'views'),
//   });
// }

export async function createApp() {
  const useCustomerLogger = process.env.NODE_ENV !== 'dev';

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    cors: true,
    logger: useCustomerLogger ? false : undefined,
  });

  const configService = app.get(ConfigService);

  if (useCustomerLogger) {
    app.useLogger(app.get(LogService));
  }

  // @ts-ignore https://helmetjs.github.io/
  await app.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    xFrameOptions: false,
  });

  setVersioning(app);
  setValidation(app);
  setSwagger(app, configService);
  return app;
}
