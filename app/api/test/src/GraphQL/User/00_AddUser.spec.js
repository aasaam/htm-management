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
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  // it should add a user
  it('graphql add user endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'maryhelper@gmail.com',
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
            $email: EmailAddress
            $password: String!
            $roles: [String]!
            $active: Boolean
          ) {
          AddUser(
              data: {
                email: $email
                password: $password
                roles: $roles
                active: $active
              }
            ) {
              email
            }
          }
        `,
        variables: {
          email: 'testusername@gmail.com',
          password: 'onCHGni7i7EfdF$@',
          roles: ['VI'],
          active: true,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.AddUser.email).toEqual('testusername@gmail.com');
  });

  it('graphql return 405 status', async () => {
    await helper.CreateUserHeaderAndToken(
      'maryhelper1@gmail.com',
      ['SA'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $email: EmailAddress
            $password: String!
            $roles: [String]!
            $active: Boolean
          ) {
          AddUser(
              data: {
                email: $email
                password: $password
                roles: $roles
                active: $active
              }
            ) {
              email
            }
          }
        `,
        variables: {
          email: 'testuser@gmail.com',
          password: 'onCHGni7i7EfdF$@',
          roles: ['VI'],
          active: true,
        },
      },
    });

    const { errors } = JSON.parse(data2.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
