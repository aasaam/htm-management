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

  it('create user & sign in :', async () => {
    const createUser = container.resolve('CreateUserRepository');

    const userData = {
      email: 'marys@gmail.com',
      password: 'onCHGni7i7EfdF$@',
      roles: ['SA'],
    };

    await createUser.addUser(userData.email, userData.password, userData.roles);

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    container.resolve('AuthREST');

    const refreshURL = fastify.openAPIBaseURL('/user/auth/refresh');
    const loginURL = fastify.openAPIBaseURL('/user/auth/login');

    // const r3 = await fastify.inject({
    //   url: loginURL,
    //   method: 'POST',
    //   payload: {
    //     email: 'noexist@tld',
    //     password: userData.password,
    //   },
    // });

    // expect(r3.statusCode).toEqual(401);

    const r1 = await fastify.inject({
      url: loginURL,
      method: 'POST',
      payload: {
        email: userData.email,
        password: userData.password,
      },
    });

    expect(r1.statusCode).toEqual(200);

    // refresh token
    // @ts-ignore
    const [{ value: AuthRefreshToken }, { value: AuthToken }] = r1.cookies;
    const r4 = await fastify.inject({
      url: refreshURL,
      method: 'GET',
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${AuthToken}; ${
          container.resolve('Config').ASM_AUTH_REFRESH_COOKIE
        }=${AuthRefreshToken}`,
      },
    });

    expect(r4.statusCode).toEqual(200);

    const r5 = await fastify.inject({
      url: refreshURL,
      method: 'GET',
      headers: {
        cookie: `so=${AuthToken}; asd=${AuthRefreshToken}`,
      },
    });

    expect(r5.statusCode).toEqual(405);
  });
});
