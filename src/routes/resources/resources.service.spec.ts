import { Test, TestingModule } from '@nestjs/testing';
import { ClsModule } from 'nestjs-cls';
import { user } from 'src/mock';
import { ContextService } from 'src/services';
import { beforeAll, describe, expect, test } from 'vitest';
import { CreateResourceDto } from './dto/create-resource.dto';
import { Resource } from './entities/resource.entity';
import { ResourcesService } from './resources.service';

describe('ResourcesService', () => {
  let service: ResourcesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModule],
      providers: [ResourcesService, ContextService],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
  });

  const mockPost: CreateResourceDto = {
    sku: 'test',
  };

  const mockRes: Resource = {
    id: 'id',
    owner: user.id,
    ...mockPost,
  };

  test('create', () => {
    const res = service.create(user.id, mockPost);
    expect(res.owner).toBe(mockRes.owner);
    expect(res.sku).toBe(mockRes.sku);
  });
});
