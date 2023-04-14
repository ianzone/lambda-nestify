import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  app: 'demo',
  service: 'service',

  frameworkVersion: '3',
  configValidationMode: 'error',
  deprecationNotificationMode: 'error',
  useDotenv: true,

  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    architecture: 'arm64',
    timeout: 29,
    tags: {
      developer: 'ian',
      project: '${self:app}',
      service: '${self:service}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'dynamodb:*',
            Resource: '*',
          },
        ],
      },
    },
    logRetentionInDays: 60,
    environment: {
      STAGE_PATH: '/${sls:stage}',
      NODE_OPTIONS: '--enable-source-maps',
      DOMAIN: '${param:domain}',
      tenantsTable: '${param:tenantsTable}',
      usersTable: '${param:usersTable}',
      DEV_PORT: '${env:DEV_PORT}',
    },
  },

  params: {
    default: {
      domain: 'my-service.my-domain.net',
      tenantsTable: '${self:app}-${self:service}-tenants-${sls:stage}',
      usersTable: '${self:app}-${self:service}-users-${sls:stage}',
    },
  },

  package: {
    individually: true,
    patterns: [
      'public/**/*',
      'views/**/*',
      'node_modules/swagger-ui-dist/swagger-ui.css',
      'node_modules/swagger-ui-dist/swagger-ui-bundle.js',
      'node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
      'node_modules/swagger-ui-dist/favicon-16x16.png',
      'node_modules/swagger-ui-dist/favicon-32x32.png',
    ],
  },

  functions: {
    api: {
      handler: 'dist/lambda.handler',
      events: [
        {
          http: {
            method: 'ANY',
            path: '{proxy+}',
            cors: true, // https://www.serverless.com/framework/docs/providers/aws/events/apigateway#enabling-cors
          },
        },
      ],
    },
  },

  plugins: [
    'serverless-esbuild',
    'serverless-prune-plugin',
    'serverless-localstack',
    'serverless-offline',
    'serverless-domain-manager',
  ],

  custom: {
    esbuild: {
      // DO NOT minify, nest relies on classnames for reflection
      sourcemap: true,
      packager: 'pnpm',
      exclude: [
        'class-transformer/storage',
        '@nestjs/websockets',
        '@nestjs/microservices',
        '@nestjs/platform-express',
      ],
    },
    prune: {
      // https://github.com/claygregory/serverless-prune-plugin
      automatic: true,
      includeLayers: true,
      number: 5,
    },
    localstack: {
      stages: ['local'],
    },
    'serverless-offline': {
      httpPort: '${env:DEV_PORT}',
      // lambdaPort: 5679,
    },
    customDomain: {
      // https://github.com/amplify-education/serverless-domain-manager
      domainName: '${param:domain}',
      certificateName: 'roomzz.net',
      basePath: '${sls:stage}',
      autoDomain: true,
    },
  },
};

module.exports = serverlessConfiguration;
