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

  it('graphql add waf and delete', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makewafd@gmail.com',
      ['SA'],
      true,
    );
    const createWaf = container.resolve('CreateWafRepository');

    const w = await createWaf.addWafProfile('profilewaf3', [
      {
        name: 'wafpro1',
        rule: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
        description: 'need this for rules.',
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
          mutation(
            $id: String!
          ) {
          DeleteWaf(
            data: {
              id: $id,
            }
            )
          }
        `,
        variables: {
          id: `${w.id}`,
        },
      },
    });

    const { data } = JSON.parse(data1.body);

    expect(data.DeleteWaf).toBeTruthy();
  });

  it('graphql delete waf endpoint error no token', async () => {
    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    const data1 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $id: String!
          ) {
          DeleteWaf(
            data: {
              id: $id,
            }
            )
          }
        `,
        variables: {
          id: '60d8d05c3a3a58607ba12222',
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });

  it('graphql delete waf endpoint error no valid role', async () => {
    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');
    const { token } = await helper.CreateUserHeaderAndToken(
      'makewafdrole@gmail.com',
      ['VI'],
      true,
    );
    const data1 = await fastify.inject({
      url: graphQLEndpoint,
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $id: String!
          ) {
          DeleteWaf(
            data: {
              id: $id,
            }
            )
          }
        `,
        variables: {
          id: '60d8d05c3a3a58607ba12222',
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(403);
  });

  it('graphql delete waf endpoint error no id param', async () => {
    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');
    const { token } = await helper.CreateUserHeaderAndToken(
      'makewafnoid@gmail.com',
      ['SA'],
      true,
    );
    const data1 = await fastify.inject({
      url: graphQLEndpoint,
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $id: String!
          ) {
          DeleteWaf(
            data: {
              id: $id,
            }
            )
          }
        `,
        variables: {
          id: '',
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(422);
  });
});
