const fastifyRateLimit = require('@fastify/rate-limit').default;

class RateLimit {
  /**
   * @param {import('fastify').FastifyInstance} fastify
   * @param {Object} container
   */
  static setup(fastify, container) {
    /** @type {import('@fastify/rate-limit').RateLimitPluginOptions} */
    const config = {
      global: false,
      max: 10,
      timeWindow: 5000,
      cache: 10000,
      allowList(req) {
        let allow = false;

        if (req.raw.token && req.raw.token.uid) {
          allow = true;
        }
        const appClientSecret = req.raw.getFirstHeader('x-client-app-secret');

        if (
          appClientSecret &&
          appClientSecret === container.Config.ASM_CLIENT_APP_SECRET_HEADER
        ) {
          allow = true;
        }

        return allow;
      },
      redis: container.redisClient,
      skipOnError: false,
      keyGenerator: (req) => {
        req.raw.addTiming('key-ratelimit');
        return req.raw.getClientIP();
      },
      addHeaders: {
        'x-ratelimit-limit': true,
        'x-ratelimit-remaining': true,
        'x-ratelimit-reset': true,
        'retry-after': true,
      },
    };

    // @ts-ignore
    fastify.register(fastifyRateLimit, config);
  }
}

module.exports = {
  RateLimit,
};
