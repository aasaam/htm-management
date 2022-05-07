const Joi = require('joi');
const validator = require('validator').default;
const { list: LoadBalanceList } = require('../Schema/LoadBMethod');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

// Custom validation
const isPort = (value, helpers) => {
  if (validator.isPort(value)) {
    return true;
  }
  return helpers.error('string.custom');
};

// Custom validation
const isIpOrDomain = (value, helpers) => {
  if (validator.isIP(value) || validator.isFQDN(value)) {
    return true;
  }
  return helpers.error('string.custom');
};

/**
 * BASE Upstream schema
 */
const base = Joi.object().keys({
  name: Joi.string()
    .required()
    .min(4)
    .max(32)
    .regex(/^[a-zA-Z][a-zA-Z0-9]{3,31}$/)
    .messages({
      'string.min': errorConstMerge.NAME_MIN,
      'string.max': errorConstMerge.NAME_MAX,
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
      'regex.base': errorConstMerge.INVALID_NAME_REGEX,
      'string.pattern.base': errorConstMerge.INVALID_NAME_REGEX,
    }),

  // 0 means false, 1 true
  advance: Joi.number().integer().valid(0, 1).required().messages({
    'number.integer': errorConstMerge.NOT_INTEGER,
    'number.base': errorConstMerge.INVALID_ADVANCE,
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),

  // required if advance is 1
  advancedBody: Joi.string().when('advance', {
    is: 1,
    then: Joi.string().required().messages({
      'string.empty': errorConstMerge.ISREQUIRE_FIELD,
    }),
  }),

  // serverList
  serverList: Joi.array().items(
    Joi.object().keys({
      server: Joi.string()
        .custom(isIpOrDomain)
        .messages({
          'string.custom': errorConstMerge.INVALID_IP_OR_DOMAIN,
        })
        .allow(null, ''),

      port: Joi.string().optional().custom(isPort).allow(null, '').messages({
        'string.custom': errorConstMerge.INVALID_PORT,
      }),
      weight: Joi.number()
        .integer()
        .min(1)
        .messages({
          'number.integer': errorConstMerge.NOT_INTEGER,
          'number.min': errorConstMerge.WEIGHT_MIN,
        })
        .allow(null, ''),

      maxConnection: Joi.number()
        .integer()
        .min(0)
        .messages({
          'number.integer': errorConstMerge.NOT_INTEGER,
          'number.min': errorConstMerge.MAX_CONNECTION_MIN,
        })
        .allow(null, ''),

      maxFails: Joi.number()
        .integer()
        .min(1)
        .messages({
          'number.integer': errorConstMerge.NOT_INTEGER,
          'number.min': errorConstMerge.MAX_FAILS_MIN,
        })
        .allow(null, ''),

      failTimeout: Joi.number()
        .integer()
        .min(10)
        .messages({
          'number.integer': errorConstMerge.NOT_INTEGER,
          'number.min': errorConstMerge.FAIL_TIMEOUT_MIN,
        })
        .allow(null, ''),

      backup: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': errorConstMerge.INVALID_BACKUP,
        })
        .allow(null, ''),

      down: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': errorConstMerge.INVALID_DOWN,
        })
        .allow(null, ''),
    }),
  ),

  // required if serverList is more than 1 and advance is 0
  loadBalanceMethod: Joi.string()
    .valid(...LoadBalanceList)
    .messages({
      'string.base': errorConstMerge.INVALID_LOAD_BALANCE_METHOD,
    }),

  keepalive: Joi.number().integer().min(8).messages({
    'number.integer': errorConstMerge.NOT_INTEGER,
    'number.min': errorConstMerge.KEEPALIVE_MIN,
  }),

  keepAliveRq: Joi.number().integer().min(1).messages({
    'number.integer': errorConstMerge.NOT_INTEGER,
    'number.min': errorConstMerge.KEEPALIVE_RQ_MIN,
  }),

  keepaliveTime: Joi.number().integer().min(1).messages({
    'number.integer': errorConstMerge.NOT_INTEGER,
    'number.min': errorConstMerge.KEEPALIVE_TIME_MIN,
  }),

  keepAliveTimeout: Joi.number().integer().min(1).messages({
    'number.integer': errorConstMerge.NOT_INTEGER,
    'number.min': errorConstMerge.KEEPALIVE_TIMEOUT_MIN,
  }),
});

/**
 * Create Upstream schema
 */

const CreateUpstreamSchema = () => base;

/**
 * Update Upstream schema
 */
const UpdateUpstreamSchema = () =>
  base.keys({
    id: Joi.string().required().messages({
      'string.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    deleted: Joi.boolean().default(false).messages({
      'boolean.base': errorConstMerge.NOT_BOOLEAN,
    }),
  });

module.exports = {
  CreateUpstreamSchema,
  UpdateUpstreamSchema,
};
