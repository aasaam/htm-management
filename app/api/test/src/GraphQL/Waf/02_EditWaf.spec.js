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

  it('graphql add waf and edit', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makewafed@gmail.com',
      ['SA'],
      true,
    );
    const createWaf = container.resolve('CreateWafRepository');

    const w = await createWaf.addWafProfile('profilewaf4ed', [
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
          mutation(
            $id: String!
            $profileName: String
            $list: [inputAddWafList]
          ) {
          EditWaf(
              data: {
                id: $id,
                profileName: $profileName,
                list: $list
              }
            )
          }
        `,
        variables: {
          id: `${w.id}`,
          profileName: 'youshalleditwaf',
          list: [
            {
              name: 'imvalidwafedit',
              rule: 'BasicRule wl:1 "mz:$HEADERS_VAR:cookie"',
              description: 'need description editing for rules.',
            },
          ],
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.EditWaf).toBeTruthy();
  });

  it('graphql edit waf error/ no valid role', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makewafedro@gmail.com',
      ['VI'],
      true,
    );
    const createWaf = container.resolve('CreateWafRepository');

    const w = await createWaf.addWafProfile('profilewaf4ed', [
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
          mutation(
            $id: String!
            $profileName: String
            $list: [inputAddWafList]
          ) {
          EditWaf(
              data: {
                id: $id,
                profileName: $profileName,
                list: $list
              }
            )
          }
        `,
        variables: {
          id: `${w.id}`,
          profileName: 'youshalleditwaf',
          list: [
            {
              name: 'imvalidwafedit',
              rule: 'BasicRule wl:13 "mz:$HEADERS_VAR:cookie"',
              description: 'need description edit for rules.',
            },
          ],
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(403);
  });

  it('graphql edit waf error/ no id', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makewafedroi@gmail.com',
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
            $id: String!
            $profileName: String
            $list: [inputAddWafList]
          ) {
          EditWaf(
              data: {
                id: $id,
                profileName: $profileName
                list: $list
              }
            )
          }
        `,
        variables: {
          id: ``,
          profileName: 'youshalleditwaf',
          list: [
            {
              name: 'imvalidwafedit',
              rule: 'BasicRule wl:13 "mz:$HEADERS_VAR:cookie"',
              description: 'need description edit for rules.',
            },
          ],
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(422);
  });
});
