import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { ContextService } from 'src/services';
import { GROUPS_KEY, Group } from './groups.decorator';

@Injectable()
export class GroupsGuard implements CanActivate {
  private readonly logger = new Logger(GroupsGuard.name);

  constructor(private readonly ctx: ContextService, private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredGroups = this.reflector.getAllAndOverride<Group[]>(GROUPS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    this.logger.debug({ requiredGroups });

    const req = context.switchToHttp().getRequest<FastifyRequest>();

    if (requiredGroups?.length) {
      const { auth } = this.ctx;
      // @ts-ignore
      if (auth.userId === req.params?.id) {
        // allow self usage
        return true;
      }
      this.logger.debug({ groups: auth.groups });
      if (auth.groups.length) {
        // eslint-disable-next-line no-restricted-syntax
        for (const group of requiredGroups) {
          if (auth.groups.includes(group)) return true;
        }
      }
      return false;
    }
    return true;
  }
}
