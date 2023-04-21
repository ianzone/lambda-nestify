import { Module } from '@nestjs/common';
import { UsersModule } from './users';
import { TenantsModule } from './tenants/tenants.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [UsersModule, TenantsModule, ResourcesModule],
})
export class RoutesModule {}
