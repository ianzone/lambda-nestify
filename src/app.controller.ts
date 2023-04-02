import { Controller, Get, InternalServerErrorException, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    this.logger.verbose('getHello', 'Hello');
    return this.appService.getHello();
  }

  @Get('error')
  error() {
    throw new Error('internal error');
  }

  @Get('exception')
  builtInError() {
    throw new InternalServerErrorException('built-in-exception');
  }
}
