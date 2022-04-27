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

    const setting = container.resolve('ActionSettingRepository');
    const conf = container.resolve('ApplySettingRepository');
    await setting.initNginxConf();
    await conf.initializeTimeConfig();

    const UserModel = container.resolve('UserModel');
    const NodeModel = container.resolve('NodeModel');
    await UserModel.deleteMany({});
    await NodeModel.deleteMany({});
  });

  afterAll(async () => {
    await new Promise((r) => {
      setTimeout(r, 100);
    });
    await container.dispose();
  });

  it('graphql add node and single', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makenodeesingle@gmail.com',
      ['SA'],
      true,
    );
    const nodeRes = await helper.createNode();

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
            $id: String!
          ) {
            SingleNode(
              data: {
                id: $id,
              }
            ) {
              id ip nodeToken port
            }
          }
        `,
        variables: {
          id: `${nodeRes.id}`,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.SingleNode).toBeTruthy();

    // error no id
    const data2 = await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          query(
            $id: String!
          ) {
            SingleNode(
              data: {
                id: $id,
              }
            ) {
              id ip nodeToken port
            }
          }
        `,
        variables: {
          id: ``,
        },
      },
    });

    const { errors } = JSON.parse(data2.body);
    expect(errors['0'].extensions.statusCode).toEqual(422);
  });

  it('graphql single node error/ no token', async () => {
    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    const data1 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          query(
            $id: String!
          ) {
            SingleNode(
              data: {
                id: $id,
              }
            ) {
              id ip nodeToken port
            }
          }
        `,
        variables: {
          id: `60d4e94ab0943741e3a55555`,
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);

    // wrong id
    const { token } = await helper.CreateUserHeaderAndToken(
      'makenodeesingleid@gmail.com',
      ['SA'],
      true,
    );

    const data3 = await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          query(
            $id: String!
          ) {
            SingleNode(
              data: {
                id: $id,
              }
            ) {
              id ip nodeToken port
            }
          }
        `,
        variables: {
          id: `60d4e94ab0943741e3a55555`,
        },
      },
    });

    const a = JSON.parse(data3.body);
    expect(a.errors['0'].extensions.statusCode).toEqual(404);
  });
});
