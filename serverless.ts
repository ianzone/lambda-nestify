import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  app: 'demo',
  service: '${self:app}-service',

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
      maintainer: 'ian',
      project: '${self:app}',
      service: '${self:service}',
    },
    iam: {
      role: {
        // https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html
        statements: [
          // https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_statement.html
          {
            Effect: 'Allow',
            Action: ['dynamodb:Scan', 'dynamodb:Query', 'dynamodb:*Item'],
            Resource: [
              { 'Fn::GetAtt': ['TenantsTable', 'Arn'] },
              { 'Fn::GetAtt': ['UsersTable', 'Arn'] },
            ],
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
      domain: '${self:service}.${env:Certificate_Name}',
      tenantsTable: '${self:app}-${self:service}-tenants-${sls:stage}',
      usersTable: '${self:app}-${self:service}-users-${sls:stage}',
    },
  },

  package: {
    individually: true,
    patterns: ['public/**/*', 'views/**/*'],
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
        '@fastify/view',
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
      certificateName: '${env:Certificate_Name}',
      basePath: '${sls:stage}',
      autoDomain: true,
    },
  },

  resources: {
    Resources: {
      TenantsTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          TableName: '${param:tenantsTable}',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            // https://www.serverless.com/blog/dynamodb-on-demand-serverless
            // https://github.com/ACloudGuru/serverless-plugin-dynamo-autoscaling
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      UsersTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          TableName: '${param:usersTable}',
          AttributeDefinitions: [
            {
              AttributeName: 'tenantId',
              AttributeType: 'S',
            },
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'tenantId',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'id',
              KeyType: 'RANGE',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
