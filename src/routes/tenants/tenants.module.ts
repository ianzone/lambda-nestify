import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';
import { Configs } from 'src/configs';
import { TenantSchema } from './schemas/tenant.schema';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';

@Global()
@Module({
  imports: [
    DynamooseModule.forFeatureAsync([{
      inject: [ConfigService],
      useFactory: (_, configs: ConfigService<Configs>) => ({
        tableName: configs.get<string>('tenantsTable'),
        schema: TenantSchema,
      }),
      name: 'tenants',
    }])
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule { }
