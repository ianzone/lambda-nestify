import { Global, Module } from '@nestjs/common';
import { MyDBService } from './databases';
import { TenantsService } from './tenants';

@Global()
@Module({
  providers: [MyDBService, TenantsService],
  exports: [TenantsService],
})
export class ServicesModule {}
