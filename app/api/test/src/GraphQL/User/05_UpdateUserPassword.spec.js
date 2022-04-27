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

  // it should create user and update password
  it('graphql user update pass inside panel endpoint', async () => {
    const { token, user } = await helper.CreateUserHeaderAndToken(
      'maryhelpers0@gmail.com',
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
        query: `
          mutation(
            $id: String!
            $newPassword: String!
            $currentPassword: String
          ) {
            UpdateUserPassword(
              data: {
                id: $id,
                newPassword: $newPassword,
                currentPassword: $currentPassword,
              }
            )
          }
        `,
        variables: {
          id: `${user.id}`,
          currentPassword: 'onCHGni7i7EfdF$@',
          newPassword: 'onCHGni7i7EfdF$@@@###',
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.UpdateUserPassword).toBeTruthy();
  });

  // it should create vi user and update password
  it('graphql user vi role update pass inside panel endpoint', async () => {
    const { token, user } = await helper.CreateUserHeaderAndToken(
      'maryhelpersdf0@gmail.com',
      ['VI'],
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
        query: `
          mutation(
            $id: String!
            $newPassword: String!
            $currentPassword: String
          ) {
            UpdateUserPassword(
              data: {
                id: $id,
                newPassword: $newPassword,
                currentPassword: $currentPassword,
              }
            )
          }
        `,
        variables: {
          id: `${user.id}`,
          newPassword: 'onCHGni7i7EfdF$@@@###',
          currentPassword: 'onCHGni7i7EfdF$@',
        },
      },
    });

    const { data } = JSON.parse(data1.body);

    expect(data.UpdateUserPassword).toBeTruthy();
  });

  // it should create user and error update password
  it('graphql user update pass error wrong id', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'maryhelpersd0@gmail.com',
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
        query: `
          mutation(
            $id: String!
            $newPassword: String!
            $currentPassword: String
          ) {
            UpdateUserPassword(
              data: {
                id: $id,
                newPassword: $newPassword,
                currentPassword: $currentPassword,
              }
            )
          }
        `,
        variables: {
          id: `60d4f7712a11e43780a49999`,
          currentPassword: 'onCHGni7i7EfdF$@',
          newPassword: 'onCHGni7i7EfdF$@@@###',
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(404);
  });

  // token error
  it('No token error:graphql user update pass', async () => {
    const { user } = await helper.CreateUserHeaderAndToken(
      'maryhelper01@gmail.com',
      ['VI'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    const data1 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $id: String!
            $newPassword: String!
            $currentPassword: String
          ) {
            UpdateUserPassword(
              data: {
                id: $id,
                newPassword: $newPassword,
                currentPassword: $currentPassword,
              }
            )
          }
        `,
        variables: {
          id: `${user.id}`,
          currentPassword: 'onCHGni7i7EfdF$@',
          newPassword: 'onCHGni7i7EfdF$@@@###',
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
