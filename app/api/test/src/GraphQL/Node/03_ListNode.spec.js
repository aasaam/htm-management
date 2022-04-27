/* eslint-disable no-underscore-dangle */
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

  it('graphql list node endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'marylistnodeg@gmail.com',
      ['SA'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    await helper.createNode();

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
            ListNode(
              args: {
                filter: $filter
                sort : $sort
                page: $page
                limit: $limit
              }
            ) { docs { id ip nodeToken port tlsVersion }
              limit totalPages totalDocs
            }
          }
        `,
        variables: {
          filter: {
            re_ip: '192',
            arrAll_active: true,
          },
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.ListNode).toBeTruthy();

    // no token error
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
            ListNode(
              args: {
                filter: $filter
                sort : $sort
                page: $page
                limit: $limit
              }
            ) { docs { ip nodeToken port tlsVersion }
              limit totalPages totalDocs
            }
          }
        `,
        variables: {},
      },
    });

    const { errors } = JSON.parse(data2.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
