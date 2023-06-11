import { Test, TestingModule } from '@nestjs/testing';
import { ClsModule, ClsService } from 'nestjs-cls';
import { auth, tenant, user } from 'src/mock';
import { ContextService, CtxStore } from 'src/services';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { CreateResourceDto } from './dto/create-resource.dto';
import { Resource } from './entities/resource.entity';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

describe('ResourcesController', () => {
  let controller: ResourcesController;
  let service: ResourcesService;
  let cls: ClsService<CtxStore>;

  const mockPost: CreateResourceDto = {
    sku: 'test',
  };

  const mockRes: Resource = {
    id: 'id',
    owner: user.id,
    ...mockPost,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModule],
      controllers: [ResourcesController],
      providers: [ResourcesService, ContextService],
    }).compile();

    controller = module.get<ResourcesController>(ResourcesController);
    service = module.get<ResourcesService>(ResourcesService);
    cls = module.get<ClsService<CtxStore>>(ClsService);
  });

  test('create resource', async () => {
    vi.spyOn(service, 'create').mockImplementation(() => mockRes);
    const res = cls.runWith({ auth, user, tenant }, () => controller.create(mockPost));
    console.log(res);
    expect(res).toBe(mockRes);
  });
});
