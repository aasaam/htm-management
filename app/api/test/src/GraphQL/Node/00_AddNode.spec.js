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

  it('graphql add node endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makenodes@gmail.com',
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
            $ip: IPv4!
            $nodeToken: String!
            $nodeId: String!
            $tlsVersion: String
            $port: String
          ) {
          AddNode(
              data: {
                ip: $ip
                nodeToken: $nodeToken
                nodeId: $nodeId
                tlsVersion: $tlsVersion
                port: $port
              }
            )
          }
        `,
        variables: {
          ip: '103.216.62.2',
          nodeToken: 'bnh5yzdirjinqaorq0ox1tf383nb3xr',
          tlsVersion: 'modern',
          port: '1081',
          nodeId: 'asd.com',
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.AddNode).toBeTruthy();
  });

  it('graphql error duplicate ip ', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makenodesun@gmail.com',
      ['SA'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $ip: IPv4!
            $nodeToken: String!
            $nodeId: String!
            $tlsVersion: String
            $port: String
          ) {
          AddNode(
              data: {
                ip: $ip
                nodeToken: $nodeToken
                nodeId: $nodeId
                tlsVersion: $tlsVersion
                port: $port
              }
            )
          }
        `,
        variables: {
          ip: '192.168.0.2',
          nodeToken: 'jbnh5yzdirjinqaorq0odx1tf383nb3xr',
          tlsVersion: 'legacy',
          port: '8080',
          nodeId: 'asds.com',
        },
      },
    });

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
            $ip: IPv4!
            $nodeToken: String!
            $nodeId: String!
            $tlsVersion: String
            $port: String
          ) {
          AddNode(
              data: {
                ip: $ip
                nodeToken: $nodeToken
                nodeId: $nodeId
                tlsVersion: $tlsVersion
                port: $port
              }
            )
          }
        `,
        variables: {
          ip: '192.168.0.2',
          nodeToken: 'jbnh5yzdirjinqaorq0odx1tf383nb3xr',
          tlsVersion: 'legacy',
          port: '8080',
          nodeId: 'asds.com',
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(422);
  });

  it('graphql add node error no token', async () => {
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
            $ip: IPv4!
            $nodeToken: String!
            $nodeId: String!
            $tlsVersion: String
            $port: String
          ) {
          AddNode(
              data: {
                ip: $ip
                nodeToken: $nodeToken
                nodeId: $nodeId
                tlsVersion: $tlsVersion
                port: $port
              }
            )
          }
        `,
        variables: {
          ip: '192.168.0.2',
          nodeToken: 'jbnh5yzdirjinqaorq0odx1tf383nb3xr',
          tlsVersion: 'legacy',
          port: '8080',
          nodeId: 'asds.com',
        },
      },
    });

    const { errors } = JSON.parse(data2.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
