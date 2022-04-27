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
    await UserModel.deleteMany({});
    const ServerModel = container.resolve('ServerModel');
    await ServerModel.deleteMany({});
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('graphql single vh', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makeupgrvhaphesingle@gmail.com',
      ['SA'],
      true,
    );

    const serverData = await helper.createAdvanceVh();

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
            SingleVh(
              data: {
                id: $id,
              }
            ) {
               name advance advancedBody
            }
          }
        `,
        variables: {
          id: `${serverData.id}`,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.SingleVh).toBeTruthy();

    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          query(
            $id: String!
          ) {
            SingleVh(
              data: {
                id: $id,
              }
            ) {
               name advance advancedBody
            }
          }
        `,
        variables: {
          id: `${serverData.id}`,
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
            SingleVh(
              data: {
                id: $id,
              }
            ) {
              _id name advance advancedBody
            }
          }
        `,
        variables: {
          id: `610663924a99052377394999`,
        },
      },
    });

    const a = JSON.parse(data3.body);
    expect(a.errors['0'].extensions.statusCode).toEqual(404);
  });
});
