const Joi = require('joi');
const validator = require('validator').default;
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const TlsVersionList = require('../Schema/TlsVersion');

// Custom validation
const isPort = (value, helpers) => {
  if (validator.isPort(value)) {
    return true;
  }
  return helpers.error('string.custom');
};

/**
 * BASE node schema
 */
const base = Joi.object().keys({
  ip: Joi.string()
    .ip({ version: ['ipv4'] })
    .required()
    .messages({
      'string.ip': errorConstMerge.IS_NOT_IP,
      'string.required': errorConstMerge.ISREQUIRE_FIELD,
    }),

  port: Joi.string().required().custom(isPort).messages({
    'string.required': errorConstMerge.ISREQUIRE_FIELD,
    'string.custom': errorConstMerge.INVALID_PORT,
  }),

  nodeId: Joi.string().required().messages({
    'string.required': errorConstMerge.ISREQUIRE_FIELD,
  }),

  nodeToken: Joi.string().required().messages({
    'string.required': errorConstMerge.ISREQUIRE_FIELD,
  }),

  tlsVersion: Joi.string()
    .default(TlsVersionList.constants.Intermediate)
    .valid('modern', 'intermediate', 'legacy')
    .required()
    .messages({
      'string.required': errorConstMerge.ISREQUIRE_FIELD,
      'any.only': errorConstMerge.INVALID_TLS_VERSION,
    }),
});

/**
 * Create node schema
 */

const CreateNodeSchema = () => base;

/**
 * Update node schema
 */
const UpdateNodeSchema = () =>
  base.keys({
    id: Joi.string().required().messages({
      'string.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    deleted: Joi.boolean().optional().messages({
      'boolean.base': errorConstMerge.NOT_BOOLEAN,
    }),
  });

module.exports = {
  CreateNodeSchema,
  UpdateNodeSchema,
};
