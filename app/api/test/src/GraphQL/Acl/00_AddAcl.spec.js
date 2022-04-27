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

  // it should add a acl
  it('graphql add acl endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makeacl@gmail.com',
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
            $name: String!,
            $mood: Int!,
            $list: [String]!
          ) {
          AddAcl(
              data: {
                name: $name,
                mood: $mood,
                list: $list
              }
            )
          }
        `,
        variables: {
          name: 'myaclprofile1',
          mood: 0,
          list: ['10.0.0.0/4'],
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.AddAcl).toBeTruthy();
  });

  // it should return error because no token.
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
            $name: String!,
            $mood: Int!,
            $list: [String]!
          ) {
          AddAcl(
              data: {
                name: $name,
                mood: $mood,
                list: $list
              }
            )
          }
        `,
        variables: {
          name: 'myaclprofile1',
          mood: 0,
          list: ['10.0.0.0/4'],
        },
      },
    });

    const { errors } = JSON.parse(data2.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
