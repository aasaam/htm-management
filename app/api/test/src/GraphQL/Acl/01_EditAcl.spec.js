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
    const AclModel = container.resolve('AclModel');
    await UserModel.deleteMany({});
    await AclModel.deleteMany({});
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  // it should edit a acl
  it('graphql delete acl ', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makeacledit@gmail.com',
      ['SA'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');
    const createAcl = container.resolve('CreateAclRepository');
    const acl = await createAcl.addAcl('gonnabeedit', 0, [
      '10.0.0.0/8',
      '172.16.0.0',
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
          mutation(
            $id: String!
            $name: String
            $mood: Int
            $list: [String]
          ) {
            EditAcl(
              data: {
                id: $id,
                name: $name,
                mood: $mood,
                list: $list
              }
            )
          }
        `,
        variables: {
          id: `${acl.id}`,
          name: 'youwilledit',
          mood: 1,
          list: ['10.0.0.0/8'],
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.EditAcl).toBeTruthy();
  });

  // it should edit a acl
  it('graphql edit error acl ', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makeacledit1@gmail.com',
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
            $name: String
            $mood: Int
            $list: [String]
          ) {
            EditAcl(
              data: {
                id: $id,
                name: $name,
                mood: $mood,
                list: $list
              }
            )
          }
        `,
        variables: {
          id: ``,
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(422);

    // no token error
    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $id: String!
            $name: String
            $mood: Int
            $list: [String]
          ) {
            EditAcl(
              data: {
                id: $id,
                name: $name,
                mood: $mood,
                list: $list
              }
            )
          }
        `,
        variables: {
          id: `60d8d05c3a3a58607ba12222`,
        },
      },
    });

    const a = JSON.parse(data2.body);
    expect(a.errors['0'].extensions.statusCode).toEqual(405);
  });
});
