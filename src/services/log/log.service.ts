import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configs } from 'src/configs';
import { ContextService } from '../context/context.service';

@Injectable()
export class MyLogger extends ConsoleLogger {
  constructor(
    private readonly ctx: ContextService,
    private readonly configs: ConfigService<Configs>,
  ) {
    super('', {
      logLevels: configs.get<Configs['logLevel']>('logLevel'),
    });
  }

  log(message: any, ...optionalParams: any[]) {
    const context = optionalParams.pop();
    if (
      this.isLevelEnabled('log') &&
      context !== 'RouterExplorer' &&
      context !== 'RoutesResolver' &&
      context !== 'NestApplication'
    ) {
      console.log(context, 'log');
      console.log(message);
      console.log();
    }
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('error')) {
      const context = optionalParams.pop();
      console.error(context, 'error');
      console.error(message);
      console.error();
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log(this.context);
    if (this.isLevelEnabled('warn')) {
      const context = optionalParams.pop();
      console.warn(context, 'warn');
      console.warn(message);
      console.warn();
    }
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('debug')) {
      const context = optionalParams.pop();
      console.debug(context, 'debug');
      console.debug(message);
      console.debug();
    }
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('verbose')) {
      const context = optionalParams.pop();
      console.info(context, 'verbose');
      console.info(message);
      console.info();
    }
  }
}
