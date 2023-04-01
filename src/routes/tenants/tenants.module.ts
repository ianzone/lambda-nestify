import { Global, Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { settings } from 'src/configs';
import { TenantSchema } from './entities/tenant.entity';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';

@Global()
@Module({
  imports: [DynamooseModule.forFeature([{ name: settings.tenantsTable, schema: TenantSchema }])],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
