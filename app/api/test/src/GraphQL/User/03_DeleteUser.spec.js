/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-env jest */

// @ts-ignore
require('../../../../globals');

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

  // it should create user return id for delete
  it('graphql delete user endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'maryhelper@gmail.com',
      ['SA'],
      true,
    );
    const { user } = await helper.CreateUserHeaderAndToken(
      'imnew@gmail.com',
      ['VI'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    const data2 = await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation($id: String!) {
            DeleteUser(
              data: {
                id: $id,
              }
            ) {
             email id
            }
          }
        `,
        variables: {
          id: `${user.id}`,
        },
      },
    });

    const a = JSON.parse(data2.body);
    expect(a.data.DeleteUser.id).toEqual(`${user.id}`);
  });

  it('Error:graphql delete user endpoint', async () => {
    const { token, user } = await helper.CreateUserHeaderAndToken(
      'maryhelper3@gmail.com',
      ['VI'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    const userId = user.id;

    const data2 = await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation($id: String!) {
            DeleteUser(
              data: {
                id: $id,
              }
            ) {
              email id
            }
          }
        `,
        variables: {
          id: `${userId}`,
        },
      },
    });

    const a = JSON.parse(data2.body);
    expect(a.errors['0'].extensions.statusCode).toEqual(403);
  });
});
