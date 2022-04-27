/* eslint-disable sonarjs/no-duplicate-string */
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
    const WafModel = container.resolve('WafModel');
    await UserModel.deleteMany({});
    await WafModel.deleteMany({});
  });

  afterAll(async () => {
    await new Promise((r) => {
      setTimeout(r, 100);
    });
    await container.dispose();
  });

  it('graphql add waf and single', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makewafesingle@gmail.com',
      ['SA'],
      true,
    );
    const createWaf = container.resolve('CreateWafRepository');

    const w = await createWaf.addWafProfile('makewafesingle', [
      {
        name: 'wafpro2e',
        rule: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
      },
    ]);

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
          SingleWaf(
              data: {
                id: $id,
              }
            ) {
              _id profileName
            }
          }
        `,
        variables: {
          id: `${w._id}`,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.SingleWaf).toBeTruthy();
  });

  it('graphql single waf error/ no valid role', async () => {
    await helper.CreateUserHeaderAndToken(
      'makewafshowrole@gmail.com',
      ['VI'],
      true,
    );
    const createWaf = container.resolve('CreateWafRepository');

    const w = await createWaf.addWafProfile('profilewaf4eds', [
      {
        name: 'wafpro2e',
        rule: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
      },
    ]);

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
          SingleWaf(
              data: {
                id: $id,
              }
            ) {
              _id profileName
            }
          }
        `,
        variables: {
          id: `${w._id}`,
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });

  it('graphql edit waf error/ no id', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makewafedroids@gmail.com',
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
            $id: String!
          ) {
          SingleWaf(
              data: {
                id: $id,
              }
            ) {
              _id profileName
            }
          }
        `,
        variables: {
          id: ``,
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(422);
  });
});
