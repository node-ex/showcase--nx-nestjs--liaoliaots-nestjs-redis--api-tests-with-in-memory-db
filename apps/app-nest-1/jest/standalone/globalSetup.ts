import type { Config } from '@jest/types';
import { debug as _debug } from 'debug';
import { RedisMemoryServer } from 'redis-memory-server';
import { RedisMemoryServerOptsT } from 'redis-memory-server/lib/RedisMemoryServer';

const debug = _debug('jest-redis:setup:custom');

export default async (
  globalConfig: Config.GlobalConfig,
  projectConfig: Config.ProjectConfig,
): Promise<void> => {
  // https://github.com/mhassan1/redis-memory-server#available-options-for-redismemoryserver
  const redisMemoryServerOptions = {
    binary: {
      version: '7.4.0',
    },
    autoStart: false,
  } as RedisMemoryServerOptsT;
  const redis = new RedisMemoryServer(redisMemoryServerOptions);
  await redis.start();

  globalThis.__REDIS_MEMORY_SERVER__ = redis;

  const isRedisRunning = !!globalThis.__REDIS_MEMORY_SERVER__.getInstanceInfo();
  // For outputting the following debug message on a new line
  debug('');
  debug('standalone setup.ts');
  debug('isRedisRunning', isRedisRunning);
};
