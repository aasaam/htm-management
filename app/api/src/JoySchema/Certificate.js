const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

/**
 * BASE Certificate schema
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

  fullChain: Joi.string().required().messages({
    'string.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
  privateKey: Joi.string().required().messages({
    'string.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
  chain: Joi.string().required().messages({
    'string.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
});

/**
 * Create Certificate schema
 */

const CreateCertSchema = () => base;

module.exports = {
  CreateCertSchema,
};
