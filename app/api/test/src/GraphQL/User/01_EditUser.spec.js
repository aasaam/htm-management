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

  it('graphql edit user', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'maryhelper@gmail.com',
      ['SA'],
      true,
    );

    const { token: user2, user: uInfo } = await helper.CreateUserHeaderAndToken(
      'viewr@gmail.com',
      ['VI'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    const createUser = container.resolve('CreateUserRepository');

    const u = await createUser.addUser(
      'artmary.ir@gmail.com',
      'onCHGni7i7EfdF$@',
      ['AD'],
      true,
    );

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
            $email: EmailAddress
            $roles: [String]
            $active: Boolean
          ) {
          EditUser(
              data: {
                id: $id,
                email: $email,
                roles: $roles
                active: $active
              }
            ) {
              email
            }
          }
        `,
        variables: {
          id: `${u.id}`,
          email: 'changed@gmail.com',
          roles: ['VI'],
          active: true,
        },
      },
    });

    const a = JSON.parse(data1.body);
    expect(a.data.EditUser.email).toEqual('changed@gmail.com');

    // edit user by editUserByMember no access to edit other user
    const data2 = await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${user2}`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $id: String!
            $email: EmailAddress
            $roles: [String]
            $active: Boolean
          ) {
          EditUser(
              data: {
                id: $id,
                email: $email,
                roles: $roles
                active: $active
              }
            ) {
              email
            }
          }
        `,
        variables: {
          id: `${u.id}`,
          email: 'smart@gmail.com',
          roles: ['VI'],
          active: true,
        },
      },
    });

    const b = JSON.parse(data2.body);
    expect(b.errors[0].message).toEqual('FORBIDDEN');

    // edit my user

    const data3 = await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${user2}`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
              mutation(
                $id: String!
                $email: EmailAddress
              ) {
              EditUser(
                  data: {
                    id: $id,
                    email: $email,
                  }
                ) {
                  email
                }
              }
            `,
        variables: {
          id: `${uInfo.id}`,
          email: 'imreallviewer@gmail.com',
        },
      },
    });

    const c = JSON.parse(data3.body);
    expect(c.data.EditUser.email).toEqual('imreallviewer@gmail.com');
    expect(c.errors).toBeUndefined();
  });

  it('graphql no token edit user: Error', async () => {
    await helper.CreateUserHeaderAndToken(
      'maryhelper88@gmail.com',
      ['SA'],
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
            $email: EmailAddress
            $roles: [String]
            $active: Boolean
          ) {
          EditUser(
              data: {
                id: $id,
                email: $email,
                roles: $roles
                active: $active
              }
            ) {
              email
            }
          }
        `,
        variables: {
          id: `60d4f7712a117e43780a488c`,
          email: 'notprev@gmail.com',
          active: true,
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
