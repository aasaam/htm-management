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
    const UpstreamModel = container.resolve('UpstreamModel');
    await UserModel.deleteMany({});
    await UpstreamModel.deleteMany({});
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('graphql single upstream', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makeupgraphesingle@gmail.com',
      ['SA'],
      true,
    );

    const upstreamRers = await helper.createAdvanceUpstream();

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
            SingleUpstream(
              data: {
                id: $id,
              }
            ) {
              serverList { server }
              _id advance name
              loadBalanceMethod keepAliveRq keepAliveTimeout advancedBody
            }
          }
        `,
        variables: {
          id: `${upstreamRers.id}`,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.SingleUpstream).toBeTruthy();

    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          query(
            $id: String!
          ) {
            SingleUpstream(
              data: {
                id: $id,
              }
            ) {
              serverList { server }
              _id advance name
              loadBalanceMethod keepAliveRq keepAliveTimeout advancedBody
            }
          }
        `,
        variables: {
          id: `${upstreamRers.id}`,
        },
      },
    });

    const { errors } = JSON.parse(data2.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);

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
            SingleUpstream(
              data: {
                id: $id,
              }
            ) {
              serverList { server }
              _id advance name
              loadBalanceMethod keepAliveRq keepAliveTimeout advancedBody
            }
          }
        `,
        variables: {
          id: ``,
        },
      },
    });

    const a = JSON.parse(data3.body);
    expect(a.errors['0'].extensions.statusCode).toEqual(422);
  });
});
