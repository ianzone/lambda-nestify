import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  app: 'roomzz',
  service: 'booking',

  frameworkVersion: '3',
  configValidationMode: 'error',

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
    logRetentionInDays: 60,
    environment: {
      STAGE_PATH_PREFIX: '/${sls:stage}',
      NODE_OPTIONS: '--enable-source-maps',
    },
  },

  package: {
    individually: true,
    // patterns: ['public/**/*', 'views/**/*'],
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
  ],

  custom: {
    esbuild: {
      sourcemap: true,
      packager: 'pnpm',
      exclude: [
        'class-transformer/storage',
        '@nestjs/websockets',
        '@nestjs/microservices',
        '@nestjs/platform-express',
        '@fastify/view',
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
      httpPort: 4567,
      lambdaPort: 4568,
    },
  },
};

module.exports = serverlessConfiguration;
