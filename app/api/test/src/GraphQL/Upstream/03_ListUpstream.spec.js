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

  it('graphql show list upstream ', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makegraphupstrist@gmail.com',
      ['SA'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');
    const createUps = container.resolve('CreateUpstreamRepository');

    await createUps.addUpstream({
      advance: 0,
      name: 'ghostgraphupstruplist',
      serverList: [
        {
          server: '127.0.0.1',
        },
        {
          server: '127.0.0.4',
          weight: 5,
          maxFails: 10,
          backup: true,
        },
      ],

      loadBalanceMethod: 'RR',
      keepAliveRq: 100,
      keepAliveTimeout: 50,
    });

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
            ListUpstream(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { _id advance name loadBalanceMethod }
              limit totalPages totalDocs
            }
          }
        `,
        variables: {
          filter: {
            re_name: 'ghost',
            arrAll_active: true,
          },
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.ListUpstream.docs).toBeTruthy();
  });

  it('error graphql show list upstream ', async () => {
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
            $filter: JSON,
            $sort: JSON,
            $page: Int,
            $limit: Int,
          ) {
            ListUpstream(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { _id advance name loadBalanceMethod }
              limit totalPages totalDocs
            }
          }
        `,
        variables: {
          filter: {
            re_name: 'ghost',
          },
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.ListUpstream).toBeFalsy();
  });
});
