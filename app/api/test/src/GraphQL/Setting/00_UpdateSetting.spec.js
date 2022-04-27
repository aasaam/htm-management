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
    const SettingModel = container.resolve('SettingModel');
    await SettingModel.deleteMany({});
    const setting = container.resolve('ActionSettingRepository');
    const conf = container.resolve('ApplySettingRepository');
    await setting.initNginxConf();
    await conf.initializeTimeConfig();
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('all setting ', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'graphsettingconf@gmail.com',
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
        query: `query ($name: String!) {
            Setting(
              data: {
                name: $name
              }
            )
          }`,
        variables: {
          name: 'nginxconf',
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.Setting).toBeTruthy();

    // ConfigReader
    const data2 = await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `query ($name: String!) {
          ConfigReader(
              data: {
                name: $name
              }
            )
          }`,
        variables: {
          name: 'changeTime',
        },
      },
    });

    const { data: res1 } = JSON.parse(data2.body);
    expect(res1.ConfigReader).toBeTruthy();

    // UpdateSetting
    await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `mutation (
          $name: String!
          $value: String!
          ) {
            UpdateSetting(
              data: {
                name: $name
                value: $value
              }
            )
          }`,
        variables: {
          name: 'nginxconf',
          value: 'test',
        },
      },
    });
  });
});
