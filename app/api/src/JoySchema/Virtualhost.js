const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list: WafModeList } = require('../Schema/WafMode');

// Custom validation
const isValidObjectId = (value, helpers) => {
  if (ObjectId.isValid(value)) {
    return true;
  }

  return helpers.error('string.custom');
};

/**
 * BASE Virtualhost schema
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
  advancedBody: Joi.string()
    .allow('')
    .when('advance', {
      is: 1,
      then: Joi.string().required().messages({
        'string.empty': errorConstMerge.ISREQUIRE_FIELD,
      }),
    }),

  certificate: Joi.string().when('advance', {
    is: 0,
    then: Joi.string().custom(isValidObjectId).required().messages({
      'string.empty': errorConstMerge.ISREQUIRE_FIELD,
      'string.custom': errorConstMerge.INVALID_OBJECTID,
    }),
  }),

  host: Joi.array()
    .items(Joi.string())
    .when('advance', {
      is: 0,
      then: Joi.array().required().messages({
        'array.base': errorConstMerge.INVALID_HOST,
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
      }),
    }),

  orgTitle: Joi.string().when('advance', {
    is: 0,
    then: Joi.string().required().messages({
      'string.empty': errorConstMerge.ISREQUIRE_FIELD,
    }),
  }),

  orgIcon: Joi.string().when('advance', {
    is: 0,
    then: Joi.string().required().messages({
      'string.empty': errorConstMerge.ISREQUIRE_FIELD,
    }),
  }),

  agentCheck: Joi.string().when('advance', {
    is: 0,
    then: Joi.string().required().messages({
      'string.empty': errorConstMerge.ISREQUIRE_FIELD,
    }),
  }),

  keepAliveRq: Joi.number().integer().min(0).allow(null).optional().messages({
    'number.integer': errorConstMerge.NOT_INTEGER,
    'number.min': errorConstMerge.INVALID_KEEP_ALIVE_RQ,
  }),

  // default: 60 seconds
  keepAliveTimeout: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .optional()
    .messages({
      'number.integer': errorConstMerge.NOT_INTEGER,
      'number.min': errorConstMerge.INVALID_KEEP_ALIVE_TIMEOUT,
    }),

  // default: 4 kb
  requestPoolSize: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      'number.integer': errorConstMerge.NOT_INTEGER,
      'number.min': errorConstMerge.INVALID_REQUEST_POOL_SIZE,
    }),

  // default: 60 seconds
  clientHeaderTimeout: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      'number.integer': errorConstMerge.NOT_INTEGER,
      'number.min': errorConstMerge.INVALID_CLIENT_HEADER_TIMEOUT,
    }),

  // default: 1 kb
  clientHeaderBufferSize: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      'number.integer': errorConstMerge.NOT_INTEGER,
      'number.min': errorConstMerge.INVALID_CLIENT_HEADER_BUFFER_SIZE,
    }),

  // default: 1 kb
  largeClientHeaderBufferSize: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      'number.integer': errorConstMerge.NOT_INTEGER,
      'number.min': errorConstMerge.INVALID_LARGE_CLIENT_HEADER_BUFFER_SIZE,
    }),

  largeClientHeaderBufferNumber: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      'number.integer': errorConstMerge.NOT_INTEGER,
      'number.min': errorConstMerge.INVALID_LARGE_CLIENT_HEADER_BUFFER_NUMBER,
    }),

  alwaysServeHttp: Joi.boolean().optional().allow(null).messages({
    'boolean.base': errorConstMerge.INVALID_ALWAYS_SERVE_HTTP,
  }),

  wafMode: Joi.string()
    .valid(...WafModeList)
    .messages({
      'string.base': errorConstMerge.INVALID_WAF_MODE,
    }),

  pageSpeed: Joi.string().valid('none', 'profile1', 'profile2').messages({
    'string.base': errorConstMerge.INVALID_PAGE_SPEED,
  }),

  protection: Joi.string()
    .custom(isValidObjectId)
    .optional()
    .allow(null, '')
    .messages({
      'string.custom': errorConstMerge.INVALID_OBJECTID,
    }),

  location: Joi.array()
    .items(
      Joi.object().keys({
        path: Joi.string().required().messages({
          'string.empty': errorConstMerge.ISREQUIRE_FIELD,
        }),

        locationType: Joi.string()
          .valid('proxy', 'redirect')
          .required()
          .messages({
            'string.base': errorConstMerge.INVALID_LOCATION_TYPE,
            'string.empty': errorConstMerge.ISREQUIRE_FIELD,
          }),

        redirectStatus: Joi.string()
          .valid('301', '302')
          .when('locationType', {
            is: 'redirect',
            then: Joi.string().required().messages({
              'string.empty': errorConstMerge.ISREQUIRE_FIELD,
            }),
          }),

        redirectToUrl: Joi.string()
          .uri()
          .when('locationType', {
            is: 'redirect',
            then: Joi.string().required().messages({
              'string.empty': errorConstMerge.ISREQUIRE_FIELD,
            }),
          }),

        upstreamProfile: Joi.string()
          .custom(isValidObjectId)
          .when('locationType', {
            is: 'proxy',
            then: Joi.string().required().messages({
              'string.empty': errorConstMerge.ISREQUIRE_FIELD,
              'string.custom': errorConstMerge.INVALID_OBJECTID,
            }),
          }),

        proxySchema: Joi.string()
          .valid('http', 'https')
          .when('locationType', {
            is: 'proxy',
            then: Joi.string().required().messages({
              'string.empty': errorConstMerge.ISREQUIRE_FIELD,
            }),
          }),

        waf: Joi.string().custom(isValidObjectId).messages({
          'string.custom': errorConstMerge.INVALID_OBJECTID,
        }),

        aclProfile: Joi.string()
          .custom(isValidObjectId)
          .allow(null, '')
          .messages({
            'string.custom': errorConstMerge.INVALID_OBJECTID,
          }),

        clientMaxBodySize: Joi.number()
          .integer()
          .min(1)
          .allow(null)
          .optional()
          .messages({
            'number.integer': errorConstMerge.NOT_INTEGER,
            'number.min': errorConstMerge.INVALID_CLIENT_MAX_BODY_SIZE,
          }),

        clientBodyBufferSize: Joi.number()
          .integer()
          .min(1)
          .allow(null)
          .optional()
          .messages({
            'number.integer': errorConstMerge.NOT_INTEGER,
            'number.min': errorConstMerge.INVALID_CLIENT_BODY_BUFFER_SIZE,
          }),

        standardCache: Joi.boolean().optional().messages({
          'boolean.base': errorConstMerge.NOT_BOOLEAN,
        }),
        activeProtection: Joi.boolean().optional().messages({
          'boolean.base': errorConstMerge.NOT_BOOLEAN,
        }),

        headers: Joi.array()
          .items(
            Joi.object()
              .keys({
                key: Joi.string().required().messages({
                  'string.empty': errorConstMerge.ISREQUIRE_FIELD,
                }),
                value: Joi.string().required().messages({
                  'string.empty': errorConstMerge.ISREQUIRE_FIELD,
                }),
              })
              .messages({
                'any.required': errorConstMerge.ISREQUIRE_FIELD,
              }),
          )
          .optional()
          .messages({
            'array.base': errorConstMerge.INVALID_HEADER,
          }),

        proxyHeaders: Joi.array()
          .items(
            Joi.object()

              .keys({
                key: Joi.string().required().messages({
                  'string.empty': errorConstMerge.ISREQUIRE_FIELD,
                }),
                value: Joi.string().required().messages({
                  'string.empty': errorConstMerge.ISREQUIRE_FIELD,
                }),
              })
              .messages({
                'any.required': errorConstMerge.ISREQUIRE_FIELD,
              }),
          )
          .optional()
          .messages({
            'array.base': errorConstMerge.INVALID_PROXY_HEADER,
          }),

        // end of location object
      }),
    )
    .when('advance', {
      is: 0,
      then: Joi.array().required().messages({
        'array.base': errorConstMerge.ISREQUIRE_FIELD,
      }),
    })
    .messages({
      'array.base': errorConstMerge.INVALID_LOCATION,
    }),
});

/**
 * Create Virtualhost schema
 */

const CreateVirtualhostSchema = () => base;

/**
 * Update Virtualhost schema
 */
const UpdateVirtualhostSchema = () =>
  base.keys({
    id: Joi.string().required().messages({
      'string.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    deleted: Joi.boolean().optional().messages({
      'boolean.base': errorConstMerge.NOT_BOOLEAN,
    }),
  });

module.exports = {
  CreateVirtualhostSchema,
  UpdateVirtualhostSchema,
};
