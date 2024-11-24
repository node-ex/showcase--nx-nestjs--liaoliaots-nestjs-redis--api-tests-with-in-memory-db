import type { Config } from '@jest/types';
import { debug as _debug } from 'debug';

const debug = _debug('jest-redis:teardown:custom');

export default async (
  globalConfig: Config.GlobalConfig,
  projectConfig: Config.ProjectConfig,
): Promise<void> => {
  debug('standalone teardown.ts');

  await globalThis.__REDIS_MEMORY_SERVER__.stop();

  const isRedisRunning = !!globalThis.__REDIS_MEMORY_SERVER__.getInstanceInfo();
  debug('isRedisRunning', isRedisRunning);
};
