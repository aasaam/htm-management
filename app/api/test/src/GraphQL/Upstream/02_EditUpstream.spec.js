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

  it('graphql edit upstream endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makeupstrgraphedit@gmail.com',
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
          mutation(
            $id: String!,
            $advance: Int!,
            $name: String!,
            $serverList: [UpStreamServerField],
            $loadBalanceMethod: String,
            $keepalive : Int,
            $keepaliveTime : Int,
            $keepAliveRq: Int,
            $keepAliveTimeout: Int,
            $advancedBody: String
            $deleted: Boolean
          ) {
            EditUpstream(
              data: {
                id: $id,
                advance: $advance,
                name: $name,
                serverList: $serverList,
                loadBalanceMethod: $loadBalanceMethod,
                keepalive: $keepalive,
                keepaliveTime: $keepaliveTime,
                keepAliveRq: $keepAliveRq,
                keepAliveTimeout: $keepAliveTimeout,
                advancedBody: $advancedBody
                deleted: $deleted
              }
            )
          }
        `,
        variables: {
          id: `${upstreamRers.id}`,
          name: 'testas',
          advance: 0,
          serverList: [
            {
              server: '127.0.0.4',
              port: '9090',
            },
          ],
          keepAliveTimeout: 50,
        },
      },
    });

    const { data } = JSON.parse(data1.body);

    expect(data.EditUpstream).toBeTruthy();

    // error no token
    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $id: String!,
            $advance: Int!,
            $name: String!,
            $serverList: [UpStreamServerField],
            $loadBalanceMethod: String,
            $keepalive : Int,
            $keepaliveTime : Int,
            $keepAliveRq: Int,
            $keepAliveTimeout: Int,
            $advancedBody: String
            $deleted: Boolean
          ) {
            EditUpstream(
              data: {
                id: $id,
                advance: $advance,
                name: $name,
                serverList: $serverList,
                loadBalanceMethod: $loadBalanceMethod,
                keepalive: $keepalive,
                keepaliveTime: $keepaliveTime,
                keepAliveRq: $keepAliveRq,
                keepAliveTimeout: $keepAliveTimeout,
                advancedBody: $advancedBody
                deleted: $deleted
              }
            )
          }
        `,
        variables: {
          id: `${upstreamRers.id}`,
          name: 'testas',
          advance: 0,
          serverList: [
            {
              server: '127.0.0.4',
              weight: 5,
              maxFails: 10,
              backup: true,
            },
          ],
          keepAliveTimeout: 50,
        },
      },
    });

    const { errors } = JSON.parse(data2.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);

    // error no id
    const data3 = await fastify.inject({
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
            $advance: Int!
            $name: String!
            $serverList: [UpStreamServerField]
            $loadBalanceMethod: String
            $keepalive : Int
            $keepaliveTime : Int
            $keepAliveRq: Int
            $keepAliveTimeout: Int
            $advancedBody: String
            $deleted: Boolean)
            {
            EditUpstream(
              data: {
                id: $id
                advance: $advance
                name: $name
                serverList: $serverList
                loadBalanceMethod: $loadBalanceMethod
                keepalive: $keepalive
                keepaliveTime: $keepaliveTime
                keepAliveRq: $keepAliveRq
                keepAliveTimeout: $keepAliveTimeout
                advancedBody: $advancedBody
                deleted: $deleted
              }
            )
          }
        `,
        variables: {
          id: ``,
          name: 'testas',
          advance: 0,
          serverList: [
            {
              server: '127.0.0.4',
              weight: 5,
              maxFails: 10,
              backup: true,
            },
          ],
          keepAliveTimeout: 50,
        },
      },
    });

    const c = JSON.parse(data3.body);
    expect(c.errors['0'].extensions.statusCode).toEqual(422);
  });
});
