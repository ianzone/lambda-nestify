import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Configs, Mode } from 'src/configs';
import { ContextService } from 'src/services';
import { GROUPS_KEY, Group } from './groups.decorator';

@Injectable()
export class GroupsGuard implements CanActivate {
  private readonly logger = new Logger(GroupsGuard.name);
  constructor(
    private readonly ctx: ContextService,
    private readonly reflector: Reflector,
    private readonly configs: ConfigService<Configs>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.configs.get('mode') === Mode.local) return true;

    const groupsSetInController = this.reflector.get<Group[]>(GROUPS_KEY, context.getHandler());
    this.logger.verbose({ groupsSetInController });

    if (groupsSetInController?.length) {
      const auth = this.ctx.auth;
      this.logger.verbose({ auth });
      const groups = auth.groups;
      if (groups.size) {
        for (const group of groupsSetInController) {
          if (groups.has(group)) return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }
}
