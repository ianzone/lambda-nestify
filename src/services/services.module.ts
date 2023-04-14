import { Global, Module } from '@nestjs/common';
import { ContextService } from './context/context.service';
import { LogService } from './log/log.service';

@Global()
@Module({
  providers: [ContextService, LogService],
  exports: [ContextService, LogService],
})
export class ServicesModule {}
