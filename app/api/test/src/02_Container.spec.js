/* eslint-env jest */

// @ts-ignore
require('../../globals');

const { initContainer } = require('../../src/Container');
const { Config } = require('../../src/Config');
const { ConfigSchema } = require('../../src/ConfigSchema');

describe(__filename.replace(__dirname, ''), () => {
  /** @type {import('awilix').AwilixContainer} */
  let container;

  beforeAll(async () => {
    const config = new Config(ConfigSchema, {});
    container = await initContainer(config);
  });
  afterAll(async () => {
    await new Promise((r) => {
      setTimeout(r, 100);
    });
    await container.dispose();
  });

  it('Logger trace', async () => {
    await container.resolve('Redis').quit();
    await container.resolve('Mongoose').disconnect();
    expect(1).toBeTruthy();
  });
});
