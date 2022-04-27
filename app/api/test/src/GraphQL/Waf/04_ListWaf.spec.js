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
    const WafModel = container.resolve('WafModel');
    await UserModel.deleteMany({});
    await WafModel.deleteMany({});
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('graphql show list waf ', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makewafist@gmail.com',
      ['SA'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');
    const createWaf = container.resolve('CreateWafRepository');

    await createWaf.addWafProfile('prowaflist', [
      {
        name: 'wafpro1',
        rule: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
        description: 'need this for rules.',
      },
    ]);

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
            ListWaf(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { _id profileName }
              limit totalPages totalDocs
            }
          }
        `,
        variables: {
          filter: {
            re_profileName: 'p',
            arrIn_pageSpeed: 1,
          },
        },
      },
    });

    const { data } = JSON.parse(data1.body);

    expect(data.ListWaf.docs).toBeTruthy();
  });

  it('error graphql show list waf ', async () => {
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
            ListWaf(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { _id profileName }
              limit totalPages totalDocs
            }
          }
        `,
        variables: {
          filter: {
            re_profileName: 'prowaf3',
          },
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.ListAcl).toBeFalsy();
  });
});
