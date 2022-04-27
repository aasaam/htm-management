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
    await new Promise((r) => {
      setTimeout(r, 100);
    });
    await container.dispose();
  });

  it('graphql add upstream endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makeupstrgraph@gmail.com',
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
            $advance: Int!,
            $name: String!,
            $serverList: [UpStreamServerField],
            $loadBalanceMethod: String,
            $keepalive : Int,
            $keepaliveTime : Int,
            $keepAliveRq: Int,
            $keepAliveTimeout: Int,
            $advancedBody: String
          ) {
            AddUpstream(
              data: {
                advance: $advance,
                name: $name,
                serverList: $serverList,
                loadBalanceMethod: $loadBalanceMethod,
                keepalive: $keepalive,
                keepaliveTime: $keepaliveTime,
                keepAliveRq: $keepAliveRq,
                keepAliveTimeout: $keepAliveTimeout,
                advancedBody: $advancedBody
              }
            )
          }
        `,
        variables: {
          advance: 0,
          name: 'ghostigraph',
          serverList: [
            {
              server: '127.0.0.1',
              weight: 1,
              maxConnection: 60,
              maxFails: 6,
              backup: true,
            },
            {
              server: '127.0.0.4',
              weight: 5,
              maxFails: 10,
              backup: true,
            },
          ],

          loadBalanceMethod: 'RR',
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.AddUpstream).toBeTruthy();

    // error no token
    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $advance: Int!,
            $name: String!,
            $serverList: [UpStreamServerField],
            $loadBalanceMethod: String,
            $keepalive : Int,
            $keepaliveTime : Int,
            $keepAliveRq: Int,
            $keepAliveTimeout: Int,
            $advancedBody: String
          ) {
            AddUpstream(
              data: {
                advance: $advance,
                name: $name,
                serverList: $serverList,
                loadBalanceMethod: $loadBalanceMethod,
                keepalive: $keepalive,
                keepaliveTime: $keepaliveTime,
                keepAliveRq: $keepAliveRq,
                keepAliveTimeout: $keepAliveTimeout,
                advancedBody: $advancedBody
              }
            )
          }
        `,
        variables: {
          advance: 0,
          name: 'ghostigraph',
          serverList: [
            {
              server: '127.0.0.1',
            },
          ],
        },
      },
    });

    const { errors } = JSON.parse(data2.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
