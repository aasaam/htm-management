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
      'makeaclsingle@gmail.com',
      ['SA'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');
    const createAcl = container.resolve('CreateAclRepository');
    const acl = await createAcl.addAcl('gonnabesingle', 0, [
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
          query(
            $id: String!
          ) {
            SingleAcl(
              data: {
                id: $id,
              }
            ) {
              id name mood list
            }
          }
        `,
        variables: {
          id: `${acl.id}`,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.SingleAcl).toBeTruthy();
  });

  it('graphql show error acl ', async () => {
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
            SingleAcl(
              data: {
                id: $id,
              }
            ) {
              id name mood list
            }
          }
        `,
        variables: {
          id: `60d8d05c3a3a58607ba12222`,
        },
      },
    });

    const { data } = JSON.parse(data1.body);

    expect(data.DeleteAcl).toBeFalsy();
  });

  it('error graphql show acl ', async () => {
    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();
    const { token } = await helper.CreateUserHeaderAndToken(
      'makeaclsingle2@gmail.com',
      ['SA'],
      true,
    );
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
            SingleAcl(
              data: {
                id: $id,
              }
            ) {
              id name mood list
            }
          }
        `,
        variables: {
          id: ``,
        },
      },
    });

    const { data } = JSON.parse(data1.body);

    expect(data.DeleteAcl).toBeFalsy();
  });

  it('error graphql show acl ', async () => {
    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();
    const { token } = await helper.CreateUserHeaderAndToken(
      'makeaclsingle23@gmail.com',
      ['SA'],
      true,
    );
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
            SingleAcl(
              data: {
                id: $id,
              }
            ) {
              id name mood list
            }
          }
        `,
        variables: {
          id: `60d8d05c3a3a58607ba12222`,
        },
      },
    });

    const { data } = JSON.parse(data1.body);

    expect(data.SingleAcl).toBeFalsy();
  });
});
