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
      console.debug(context, 'DEBUG', JSON.stringify(message, null, 2), ...optionalParams);
    }
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('verbose')) {
      const context = optionalParams.pop();
      console.info(context, 'VERBOSE', JSON.stringify(message, null, 2), ...optionalParams);
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
      console.log(context, 'LOG', JSON.stringify(message, null, 2), ...optionalParams);
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('warn')) {
      const context = optionalParams.pop();
      console.warn(context, 'WARN', JSON.stringify(message, null, 2), ...optionalParams);
    }
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('error')) {
      const context = optionalParams.pop();
      console.error(context, 'ERROR', JSON.stringify(message, null, 2), ...optionalParams);
    }
  }
}
