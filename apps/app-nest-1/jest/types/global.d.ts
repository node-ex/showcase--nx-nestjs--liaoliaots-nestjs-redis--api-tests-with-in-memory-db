import { RedisMemoryServer } from 'redis-memory-server';
import type { Redis } from 'ioredis';

declare global {
  /**
   * Available in the global Node.js context
   */
  // eslint-disable-next-line no-var
  var __REDIS_MEMORY_SERVER__: RedisMemoryServer;

  /**
   * Available in the isolated test context
   */
  // eslint-disable-next-line no-var
  var __IOREDIS_CONNECTION__: Redis;
}

export {};
