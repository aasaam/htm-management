/* eslint-env jest */

// @ts-ignore
require('../../../globals');

const { initContainer } = require('../../../src/Container');
const { Config } = require('../../../src/Config');
const { ConfigSchema } = require('../../../src/ConfigSchema');
// const Helper = require('../Helper/Helper');

describe(__filename.replace(__dirname, ''), () => {
  /** @type {import('awilix').AwilixContainer} */
  let container;
  /** @type {import('../Helper/Helper')} */
  // let helper;

  beforeAll(async () => {
    const config = new Config(ConfigSchema, {});
    container = await initContainer(config);

    // helper = new Helper(container);

    const UserModel = container.resolve('UserModel');
    await UserModel.deleteMany();
  });

  afterAll(async () => {
    await new Promise((r) => {
      setTimeout(r, 100);
    });
    await container.dispose();
  });

  it('logout', async () => {
    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    container.resolve('LogoutREST');

    const logURL = fastify.openAPIBaseURL('/user/logout');

    const res = await fastify.inject({
      url: logURL,
      method: 'GET',
      payload: {},
    });

    expect(res.statusCode).toEqual(204);
  });
});
