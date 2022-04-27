const { resolve } = require('path');
const { createContainer, asValue, asClass, Lifetime } = require('awilix');
const fs = require('fs');

// logger
const { Logger } = require('./Logger');

// graphql
const graphqlTypeDefsLoader = require('./GraphQL/typeDefs');
const graphqlResolvers = require('./GraphQL/resolvers');

// dependencies
const Redis = require('./Connections/Redis');
const Mongoose = require('./Connections/Mongoose');

const RootCa = fs.readFileSync('/app/api/conf/root.pem');

/**
 * @param {import('./Config').Config} Config
 * @return {Promise<import('awilix').AwilixContainer>}
 */
const initContainer = async (Config) => {
  const container = createContainer();

  container.register({
    // config
    Config: asValue(Config.getAll()),
    PublicConfig: asValue(Config.getPublic()),

    // logger
    Logger: asValue(new Logger(Config.getAll())),

    // RootCa
    RootCa: asValue(RootCa),
  });

  // Redis
  container.register({
    Redis: asClass(Redis, {
      lifetime: Lifetime.SINGLETON,
      async dispose(i) {
        await i.quit();
      },
    }),
  });
  const redisClient = await container.resolve('Redis').getRedis();
  const mQEmitter = await container.resolve('Redis').getMQEmitter();

  // Mongoose
  container.register({
    Mongoose: asClass(Mongoose, {
      lifetime: Lifetime.SINGLETON,
      async dispose(i) {
        await i.disconnect();
      },
    }),
  });
  await container.resolve('Mongoose').getMongooseConnection();

  // Mongoose Models
  container.loadModules([`${resolve(__dirname, 'Mongoose/*.js')}`], {
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
    },
  });

  const graphqlTypeDefs = await graphqlTypeDefsLoader();

  container.register({
    redisClient: asValue(redisClient),
    mQEmitter: asValue(mQEmitter),

    graphqlTypeDefs: asValue(graphqlTypeDefs),
    graphqlResolvers: asValue(graphqlResolvers),
  });

  // Repository
  container.loadModules([`${resolve(__dirname, 'Repository/**/*.js')}`], {
    formatName(name) {
      return `${name}Repository`;
    },
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
    },
  });

  // Repository
  container.loadModules([`${resolve(__dirname, 'OpenAPI/**/*REST.js')}`], {
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
    },
  });

  // Core
  container.loadModules([`${resolve(__dirname, 'Core/*.js')}`], {
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
    },
  });

  return container;
};

module.exports = { initContainer };
