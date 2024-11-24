import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { RedisModule } from './redis.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Server } from 'net';

describe('CoffeesController', () => {
  // https://github.com/nestjs/nest/issues/13191
  let app: INestApplication<NestExpressApplication & Server>;

  beforeEach(async () => {
    /**
     * https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
     */
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    /**
     * Don't forget to close the app after the tests, otherwise Jest will hang,
     * because of an open connection from the RedisModule.
     */
    await app.close();
    jest.restoreAllMocks();
  });

  it('SET /redis', async () => {
    const resultBeforePost = await request(app.getHttpServer())
      .get('/redis')
      .expect(200);
    expect(resultBeforePost.body).toEqual({ myKey: null });

    await request(app.getHttpServer())
      .post('/redis')
      .send({ newValue: 'value' })
      .expect(200);

    const resultAfterPost = await request(app.getHttpServer())
      .get('/redis')
      .expect(200);
    expect(resultAfterPost.body).toEqual({ myKey: 'value' });
  });
});
