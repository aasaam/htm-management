/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-env jest */

// @ts-ignore
require('../../../../globals');
const id = require('mongoose').Types.ObjectId();
const { initContainer } = require('../../../../src/Container');
const { Config } = require('../../../../src/Config');
const { ConfigSchema } = require('../../../../src/ConfigSchema');
const Helper = require('../../Helper/Helper');

describe(__filename.replace(__dirname, ''), () => {
  /** @type {import('awilix').AwilixContainer} */
  let container;

  /** @type {import('../../Helper/Helper')} */
  let helper;

  beforeAll(async () => {
    const config = new Config(ConfigSchema, {});
    container = await initContainer(config);
    helper = new Helper(container);

    const UserModel = container.resolve('UserModel');

    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await new Promise((r) => {
      setTimeout(r, 100);
    });
    await container.dispose();
  });

  it('graphql show user profile ', async () => {
    const { token, user } = await helper.CreateUserHeaderAndToken(
      'graphuserprofile@gmail.com',
      ['SA'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    const data1 = await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      url: graphQLEndpoint,
      method: 'POST',

      payload: {
        operationName: null,

        query: `query ($id: String!) {
            ProfileUser(
              data: {
                id: $id
              }
            ) {
              id roles active email otpSecret active
            }
          }`,
        variables: {
          id: user.id,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.ProfileUser.id).toBe(user.id);

    // no id error
    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      payload: {
        operationName: null,

        query: `query ($id: String!) {
            ProfileUser(
              data: {
                id: $id
              }
            ) {
              id roles active email otpSecret active
            }
          }`,
        variables: {
          id: '',
        },
      },
    });

    const a = JSON.parse(data2.body);
    expect(a.data.ProfileUser).toBe(null);
  });

  it('graphql show user error ', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'graphuserprofileerror@gmail.com',
      ['VI'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    // no user found
    const data3 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      payload: {
        operationName: null,
        query: `query ($id: String!) {
          ProfileUser(
            data: {
              id: $id
            }
          ) {
            id roles active email otpSecret active
          }
        }`,
        variables: {
          id,
        },
      },
    });

    const b = JSON.parse(data3.body);
    expect(b.data.ProfileUser).toBe(null);
  });
});
