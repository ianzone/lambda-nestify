import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from './app.module';

// https://github.com/jmcdo29/nest-cookies/blob/main/test/fastify.e2e-spec.ts#L47
describe('App (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ GET', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('Hello World!');
  });

  it('/users GET', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/users',
      headers: {
        authorization: 'Bearer authorization',
      },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('This action returns all users');
  });
}, 15000);
