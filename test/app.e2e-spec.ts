import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

// https://github.com/jmcdo29/nest-cookies/blob/main/test/fastify.e2e-spec.ts#L47
describe('App (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('/ GET', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('Hello World!');
  });
}, 15000);
