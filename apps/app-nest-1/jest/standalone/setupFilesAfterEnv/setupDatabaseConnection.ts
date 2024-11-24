import { Test } from '@nestjs/testing';
import { RedisModule } from '../../../src/redis/redis.module';
import { DEFAULT_REDIS, RedisService } from '@liaoliaots/nestjs-redis';
import { debug as _debug } from 'debug';

const debug = _debug('jest-redis:setupFilesAfterEnv:setupDatabaseConnection');

beforeAll(async () => {
  /**
   * Create a new NestJS application with the RedisModule that uses
   * the connection string from the environment variable set in the
   * testEnvironment.ts file.
   */
  const app = await Test.createTestingModule({
    imports: [RedisModule],
  }).compile();

  const redisService = app.get<RedisService>(RedisService);
  const redis = redisService.getOrThrow(DEFAULT_REDIS);
  globalThis.__IOREDIS_CONNECTION__ = redis;
});

afterEach(async () => {
  debug('deleting all keys with a specific prefix');

  const redis = globalThis.__IOREDIS_CONNECTION__;
  const pattern = process.env['REDIS_KEY_PREFIX']! + '*';
  let cursor = '0';
  do {
    const [nextCursor, keysWithPrefix] = await redis.scan(
      cursor,
      'MATCH',
      pattern,
      'COUNT',
      100,
    );
    cursor = nextCursor;
    debug(
      `keys to delete (${String(keysWithPrefix.length)}): ${keysWithPrefix.join(
        ', ',
      )}`,
    );

    /**
     * Keys returned by the SCAN command are prefixed with the prefix set in
     * the RedisModule.
     *
     * https://github.com/redis/ioredis#transparent-key-prefixing
     */
    const keysWithoutPrefix = keysWithPrefix.map((key) =>
      key.replace(process.env['REDIS_KEY_PREFIX']!, ''),
    );
    if (keysWithoutPrefix.length > 0) {
      const deletedKeyCount = await redis.del(...keysWithoutPrefix);
      debug(`count of deleted keys: ${String(deletedKeyCount)}`);
    }
  } while (cursor !== '0');
});

afterAll(() => {
  globalThis.__IOREDIS_CONNECTION__.disconnect();
});
