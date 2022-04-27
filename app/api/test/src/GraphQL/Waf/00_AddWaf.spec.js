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
    await new Promise((r) => {
      setTimeout(r, 100);
    });
    await container.dispose();
  });

  it('graphql add waf endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makewaf@gmail.com',
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
            $profileName: String!
            $list: [inputAddWafList]!
          ) {
          AddWaf(
              data: {
                profileName: $profileName,
                list: $list
              }
            )
          }
        `,
        variables: {
          profileName: 'grphohwaftest',
          list: [
            {
              name: 'imvalidwaf',
              rule: 'BasicRule wl:1 "mz:$HEADERS_VAR:cookie"',
              description: 'need description for rules.',
            },
          ],
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.AddWaf).toBeTruthy();
  });

  it('graphql add waf endpoint error invalid name', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makewaf2@gmail.com',
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
            $profileName: String!
            $list: [inputAddWafList]!
          ) {
          AddWaf(
              data: {
                profileName: $profileName,
                list: $list
              }
            )
          }
        `,
        variables: {
          profileName: 'g',
          list: [
            {
              name: 'imvalidwaf',
              rule: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
              description: 'need this for rules.',
            },
          ],
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(422);
  });

  it('graphql return 405 status', async () => {
    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $profileName: String!
            $list: [inputAddWafList]!
          ) {
          AddWaf(
              data: {
                profileName: $profileName,
                list: $list
              }
            )
          }
        `,
        variables: {
          profileName: 'grphohwaftest',
          list: [
            {
              name: 'imvalidwaf',
              rule: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
              description: 'need this for rules.',
            },
          ],
        },
      },
    });

    const { errors } = JSON.parse(data2.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
