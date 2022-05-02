const { list: LanguageCodes } = require('./Schema/LanguageCodes');

const TEST_MODE = process.env.ASM_PUBLIC_APP_TEST === 'true';

/** @type {import('json-schema').JSONSchema7} */
const ConfigSchema = {
  type: 'object',
  required: [
    // public
    'ASM_PUBLIC_APP_NS',
    'ASM_PUBLIC_APP_TEST',
    'ASM_PUBLIC_APP_TITLE',
    'ASM_PUBLIC_BASE_URL',
    'ASM_PUBLIC_POST_UPLOADED_SIZE_BYTES',

    // private
    'ASM_PM_ID',
    'ASM_APP_INSTANCE',
    'ASM_APP_PORT',
    'ASM_AUTH_COOKIE',
    'ASM_AUTH_HMAC_SECRET',
    'ASM_AUTH_HMAC_ALG',
    'ASM_LOG_LEVEL',

    // resource
    'ASM_REDIS_URI',
    'ASM_SMTP_URI',
    'ASM_ZIP_PASSWORD',
    // 'ASM_MONGODB_URI',
  ],
  properties: {
    ASM_PM_ID: {
      type: 'number',
      description: 'PM2 process identifier',
      default: 0,
      minimum: 0,
    },

    ASM_FETCH_TIMEOUT: {
      type: 'number',
      description: 'Fetch timeout in seconds',
      default: 10000,
    },

    ASM_DEFAULT_ADMIN_EMAIL: {
      type: 'string',
      description: 'Default administrator email',
      default: 'superadmin@example.tld',
    },

    ASM_PUBLIC_APP_TITLE: {
      type: 'string',
      description: 'Application title',
      default: 'Test Application',
    },

    ASM_CLIENT_APP_SECRET_HEADER: {
      type: 'string',
      description: 'Client application secret header for bypass ratelimit',
      minLength: 32,
      maxLength: 64,
      default: '000000000000000000000000000000000000000000000000',
    },

    ASM_PUBLIC_APP_LANG: {
      type: 'string',
      description: 'Application default language',
      enum: LanguageCodes,
      default: 'fa',
    },

    ASM_PUBLIC_APP_SUPPORTED_LANGS: {
      type: 'string',
      description: 'Application default language',
      // @ts-ignore
      separator: ',',
      default: 'fa',
    },

    ASM_PUBLIC_APP_NS: {
      type: 'string',
      description: 'Application name space. **Do not change after deployment**',
      pattern: '[a-z][a-z\\-][a-z]',
      default: 'htm-test',
    },

    ASM_PUBLIC_APP_TEST: {
      type: 'boolean',
      description: 'Application is in testing mode',
      default: false,
    },

    ASM_PUBLIC_BASE_URL: {
      type: 'string',
      description: 'Base URL of application. Example: `/` or `/base-path/`',
      default: '/',
    },

    ASM_PUBLIC_POST_UPLOADED_SIZE_BYTES: {
      type: 'number',
      description: 'Max size of uploaded file bytes in single request',
      default: 4194304,
    },

    ASM_AUTH_COOKIE: {
      type: 'string',
      description: 'Authentication cookie name',
      default: TEST_MODE ? 'AuthToken' : '__Host-AuthToken',
    },

    ASM_PUBLIC_AUTH_TOKEN_TTL: {
      type: 'number',
      description: 'Time to live for main token in seconds',
      minimum: 300,
      maximum: 3600,
      default: 900,
    },

    ASM_AUTH_REFRESH_COOKIE: {
      type: 'string',
      description: 'Authentication refresh cookie name',
      default: TEST_MODE ? 'AuthRefreshToken' : '__Host-AuthRefreshToken',
    },

    ASM_PUBLIC_AUTH_REFRESH_TOKEN_TTL: {
      type: 'number',
      description: 'Time to live for refresh token in seconds',
      minimum: 14400,
      maximum: 86400,
      default: 43200,
    },

    ASM_PUBLIC_AUTH_REFRESH_TOKEN_REMEMBER_TTL: {
      type: 'number',
      description: 'Time to live for remember refresh token in seconds',
      minimum: 86400,
      maximum: 2592000,
      default: 604800,
    },

    ASM_AUTH_HMAC_ALG: {
      type: 'string',
      description: 'Application authentication HMAC algorithm',
      default: 'HS256',
      enum: ['HS256', 'HS384', 'HS512'],
    },

    ASM_AUTH_HMAC_SECRET: {
      type: 'string',
      description: 'Application authentication HMAC secret',
      default: TEST_MODE ? '0123456789ABCDEFGHIJKLMNOPQRSTUV' : '',
      minLength: 32,
      maxLength: 512,
    },

    ASM_APP_PORT: {
      type: 'number',
      description: 'Application HTTP port',
      default: 3001,
      minimum: 1025,
      maximum: 49151,
    },

    ASM_LOG_LEVEL: {
      type: 'number',
      description: 'Log level of application',
      enum: [1, 2, 3, 4, 5],
      default: TEST_MODE ? 2 : 4,
      minimum: 1,
      maximum: 5,
    },

    ASM_LOG_STDOUT_FILTER: {
      type: 'string',
      // @ts-ignore
      separator: ',',
      default: 'def,http,mongo',
    },

    ASM_APP_INSTANCE: {
      type: 'number',
      description: 'Application cluster number',
      default: 2,
      minimum: 1,
      maximum: 16,
    },

    ASM_SMTP_URI: {
      type: 'string',
      description: 'Connection URI for SMTP',
      default: 'smtp://username:password@htm-mail:1025/?pool=true',
    },

    ASM_ZIP_PASSWORD: {
      type: 'string',
      description: 'Password for backup zip file.',
      default: 'drink_coffee',
    },

    ASM_SMTP_SENDER: {
      type: 'string',
      description: 'Fake email to send',
      default: 'noreply@gmail.com',
    },

    ASM_REDIS_URI: {
      type: 'string',
      description: 'Connection URI for Redis for share data purpose',
      default: 'redis://htm-redis',
    },

    ASM_MONGODB_URI: {
      type: 'string',
      description: 'Connection URI for MongoDB',
      default: 'mongodb://htm-mongo/database',
    },
  },
};

module.exports = { ConfigSchema };
