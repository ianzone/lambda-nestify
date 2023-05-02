import { Test, TestingModule } from '@nestjs/testing';
import { ClsModule } from 'nestjs-cls';
import { ContextService } from 'src/services';
import { beforeAll, describe, expect, test } from 'vitest';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

describe('ResourcesController', () => {
  let controller: ResourcesController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModule],
      controllers: [ResourcesController],
      providers: [ResourcesService, ContextService],
    }).compile();

    controller = module.get<ResourcesController>(ResourcesController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
