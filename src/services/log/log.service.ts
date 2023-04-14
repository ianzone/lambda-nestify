import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configs } from 'src/configs';
import { ContextService } from '../context/context.service';

@Injectable()
export class LogService extends ConsoleLogger {
  constructor(
    private readonly ctx: ContextService,
    private readonly configs: ConfigService<Configs, true>,
  ) {
    super('', {
      logLevels: configs.get('logLevel'),
    });
  }

  // level: debug -> verbose -> info -> warning -> error
  debug(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('debug')) {
      const context = optionalParams.pop();
      console.debug(context, 'DEBUG');
      console.debug(message);
      console.debug();
    }
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('verbose')) {
      const context = optionalParams.pop();
      console.info(context, 'VERBOSE');
      console.info(message);
      console.info();
    }
  }

  log(message: any, ...optionalParams: any[]) {
    const context = optionalParams.pop();
    if (
      this.isLevelEnabled('log') &&
      context !== 'RouterExplorer' &&
      context !== 'RoutesResolver' &&
      context !== 'NestApplication'
    ) {
      console.log(context, 'LOG');
      console.log(message);
      console.log();
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log(this.context);
    if (this.isLevelEnabled('warn')) {
      const context = optionalParams.pop();
      console.warn(context, 'WARN');
      console.warn(message);
      console.warn();
    }
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('error')) {
      const context = optionalParams.pop();
      console.error(context, 'ERROR');
      console.error(message);
      console.error();
    }
  }
}
