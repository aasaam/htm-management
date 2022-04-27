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
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('graphql show list user ', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makeuserist@gmail.com',
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
          query(
            $filter: JSON,
            $sort: JSON,
            $page: Int,
            $limit: Int,
          ) {
            ListUser(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { _id email roles active }
              limit totalPages totalDocs
            }
          }
        `,
        variables: {
          filter: {
            re_email: 'make',
            arrAll_active: true,
          },
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.ListUser.docs).toBeTruthy();

    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          query(
            $filter: JSON,
            $sort: JSON,
            $page: Int,
            $limit: Int,
          ) {
            ListUser(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { _id  email roles active }
              limit totalPages totalDocs
            }
          }
        `,
        variables: {
          filter: {
            re_email: 'make',
          },
        },
      },
    });

    const a = JSON.parse(data2.body);
    expect(a.errors['0'].extensions.statusCode).toEqual(405);
  });
});
