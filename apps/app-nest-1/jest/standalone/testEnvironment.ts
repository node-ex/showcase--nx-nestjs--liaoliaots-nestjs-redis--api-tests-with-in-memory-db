import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from '@jest/environment';
import { TestEnvironment as NodeEnvironment } from 'jest-environment-node';
import { debug as _debug } from 'debug';
import { createHash } from 'crypto';

const debug = _debug('jest-redis:environment:custom');

export default class TestEnvironment extends NodeEnvironment {
  testFilePath: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    debug('standalone TestEnvironment.constructor');

    this.testFilePath = context.testPath;

    debug('this.testFilePath', this.testFilePath);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  override async setup() {
    await super.setup();

    const isRedisRunning =
      !!globalThis.__REDIS_MEMORY_SERVER__.getInstanceInfo();
    debug('standalone TestEnvironment.setup');
    debug('isRedisRunning', isRedisRunning);

    /**
     * Requirements for the key (prefix):
     * - Keys are binary safe, so even content of a JPEG file can be used as a key
     * - Must be at least 1 character long and no more than 512 MB long
     *
     * MD5 hash in a hexadecimal format is 32 characters long and contains only
     * ASCII letters and numbers, so it should be a valid key (prefix).
     *
     * Sources
     * - https://redis.io/docs/latest/develop/use/keyspace/
     */
    const redisKeyPrefix =
      createHash('md5').update(this.testFilePath).digest('hex') + ':';
    const redisHost = await globalThis.__REDIS_MEMORY_SERVER__.getHost();
    const redisPort = await globalThis.__REDIS_MEMORY_SERVER__.getPort();
    /**
     * When REDIS_* environment variable is set via process.env here, tests do
     * not see this change because they are run inside the `this.global` vm
     * context that is isolated from the global Node.js context. Only
     * environment variables present in the global Node.js context
     * (process.env) at the time of isolated context creation are available to
     * the tests.
     *
     * But setting it via this.global.process.env works.
     */
    this.global.process.env['REDIS_HOST'] = redisHost;
    this.global.process.env['REDIS_PORT'] = String(redisPort);
    this.global.process.env['REDIS_KEY_PREFIX'] = redisKeyPrefix;
    this.global.process.env['REDIS_PASSWORD'] = '';

    debug('process.env[REDIS_HOST]', process.env['REDIS_HOST']);
    debug(
      'this.global.process.env[REDIS_HOST]',
      this.global.process.env['REDIS_HOST'],
    );

    debug('process.env[REDIS_PORT]', process.env['REDIS_PORT']);
    debug(
      'this.global.process.env[REDIS_PORT]',
      this.global.process.env['REDIS_PORT'],
    );

    debug('process.env[REDIS_KEY_PREFIX]', process.env['REDIS_KEY_PREFIX']);
    debug(
      'this.global.process.env[REDIS_KEY_PREFIX]',
      this.global.process.env['REDIS_KEY_PREFIX'],
    );

    debug('process.env[REDIS_PASSWORD]', process.env['REDIS_PASSWORD']);
    debug(
      'this.global.process.env[REDIS_PASSWORD]',
      this.global.process.env['REDIS_PASSWORD'],
    );
  }

  override async teardown() {
    debug('standalone TestEnvironment.teardown - before super');
    await super.teardown();
    debug('standalone TestEnvironment.teardown - after super');
  }

  override getVmContext() {
    /* A lot of calls... */
    // debug('standalone TestEnvironment.getVmContext');
    return super.getVmContext();
  }
}
