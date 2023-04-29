import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class InternalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<FastifyRequest>();

    const token = req?.headers?.authorization?.split('Bearer ')[1];

    if (token === 'Secure_2023') {
      return true;
    }
    return false;
  }
}
