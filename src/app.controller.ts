import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
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
