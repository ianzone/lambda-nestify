import { Global, Module } from '@nestjs/common';
import { ContextService } from './context/context.service';
import { MyLogger } from './log/log.service';

@Global()
@Module({
  providers: [ContextService, MyLogger],
  exports: [ContextService, MyLogger],
})
export class ServicesModule {}
