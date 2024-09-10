import { Schema as DynamoSchema } from 'dynamoose';
import type { SchemaDefinition } from 'dynamoose/dist/Schema';
import type { Schema } from 'type-fest';

export interface SDK {
  key: string;
}

export interface Url {
  apps: string;
  portal: string;
  terms: string;
  privacy: string;
}

export interface Tenant {
  id: string;
  name: string;
  clientId: string[];
  url: Url;
  sdk: SDK;
}

const tenant: Schema<Tenant, SchemaDefinition[string] | any> = {
  id: {
    type: String,
    required: true,
    hashKey: true, // mark this property as the hash key
  },
  name: String,
  clientId: {
    // @ts-ignore
    type: Array,
    schema: [String],
  },
  url: {
    type: Object,
    schema: {
      apps: String,
      portal: String,
      terms: String,
      privacy: String,
    },
  },
  sdk: {
    type: Object,
    schema: {
      key: String,
    },
  },
};

export const TenantSchema = new DynamoSchema(tenant, {
  timestamps: {
    createdAt: {
      createdAt: {
        type: {
          value: Date,
          settings: {
            storage: 'seconds',
          },
        },
      },
    },
    updatedAt: {
      updatedAt: {
        type: {
          value: Date,
          settings: {
            storage: 'seconds',
          },
        },
      },
    },
  },
});
