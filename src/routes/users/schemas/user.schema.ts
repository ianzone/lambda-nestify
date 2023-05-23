import { Schema as DynamoSchema } from 'dynamoose';
import { SchemaDefinition } from 'dynamoose/dist/Schema';
import { Schema } from 'type-fest';

export interface User {
  tenantId: string;
  id: string;
  email: string;
  name: string;
}

const user: Schema<User, SchemaDefinition[string]> = {
  tenantId: {
    type: String,
    required: true,
    hashKey: true,
  },
  id: {
    type: String,
    required: true,
    rangeKey: true,
  },
  email: String,
  name: String,
};

export const UserSchema = new DynamoSchema(user, { timestamps: true });
