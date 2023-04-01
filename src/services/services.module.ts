import { Global, Module } from '@nestjs/common';
import { ContextService } from './context/context.service';

@Global()
@Module({
  providers: [ContextService],
  exports: [ContextService],
})
export class ServicesModule {}
