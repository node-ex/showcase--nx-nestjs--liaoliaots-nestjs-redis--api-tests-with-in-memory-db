import { debug as _debug } from 'debug';

const debug = _debug('jest-redis:test');

describe('Index', () => {
  it('test1', async () => {
    debug("process.env['REDIS_HOST']", process.env['REDIS_HOST']);
    debug("process.env['REDIS_PORT']", process.env['REDIS_PORT']);
    debug("process.env['REDIS_KEY_PREFIX']", process.env['REDIS_KEY_PREFIX']);
    debug("process.env['REDIS_PASSWORD']", process.env['REDIS_PASSWORD']);

    await globalThis.__IOREDIS_CONNECTION__.set('test1', 'test');
    const keyNames = await globalThis.__IOREDIS_CONNECTION__.keys('*');
    debug('test1 keyNames', keyNames);

    expect(true).toBe(true);
  });

  it('test2', async () => {
    await globalThis.__IOREDIS_CONNECTION__.set('test2', 'test');
    const keyNames = await globalThis.__IOREDIS_CONNECTION__.keys('*');
    debug('test2 keyNames', keyNames);

    expect(true).toBe(true);
  });
});
