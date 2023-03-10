import { SetMetadata } from '@nestjs/common';

export enum Group {
  admin = 'admin',
}
export const GROUPS_KEY = 'groups';
export const Groups = (...groups: Group[]) => SetMetadata(GROUPS_KEY, groups);
