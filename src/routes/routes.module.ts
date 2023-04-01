import { Module } from '@nestjs/common';
import { UsersModule } from './users';
import { TenantsModule } from './tenants/tenants.module';

@Module({
  imports: [UsersModule, TenantsModule],
})
export class RoutesModule {}
