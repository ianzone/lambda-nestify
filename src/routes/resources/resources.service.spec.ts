import { Test, TestingModule } from '@nestjs/testing';
import { ClsModule, ClsService } from 'nestjs-cls';
import { auth, tenant, user } from 'src/mock';
import { ContextService, CtxStore } from 'src/services';
import { beforeAll, describe, expect, test } from 'vitest';
import { ResourcesService } from './resources.service';

describe('ResourcesService', () => {
  let service: ResourcesService;
  let cls: ClsService<CtxStore>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModule],
      providers: [ResourcesService, ContextService],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
    cls = module.get<ClsService<CtxStore>>(ClsService);
  });

  test('findAll', () => {
    const res = cls.runWith({ auth, user, tenant }, () => service.findAll());
    console.log(res);
    expect(res).toBe(`This action returns all resources of the user ${user.name}`);
  });

  test('findOne', () => {
    const res = cls.runWith({ auth, user, tenant }, () => service.findOne(user.id));
    console.log(res);
    expect(res).toBe(`This action returns the #${user.id} resource`);
  });

  test('remove', () => {
    const res = cls.runWith({ auth, user, tenant }, () => service.remove(user.id));
    console.log(res);
    expect(res).toBe(`This action removes the #${user.id} resource`);
  });
});
