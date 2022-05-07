const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

// Custom validation
const isBasicRule = (value, helpers) => {
  if (value.startsWith('BasicRule')) {
    return true;
  }

  return helpers.error('string.custom');
};

/**
 * BASE waf schema
 */
const base = Joi.object().keys({
  profileName: Joi.string()
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

  list: Joi.array().items(
    Joi.object().keys({
      name: Joi.string().required().min(3).max(32).messages({
        'string.min': errorConstMerge.NAME_MIN,
        'string.max': errorConstMerge.NAME_MAX,
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
      }),
      rule: Joi.string().required().custom(isBasicRule).messages({
        'string.required': errorConstMerge.ISREQUIRE_FIELD,
        'string.custom': errorConstMerge.INVALID_WAF_RULE,
      }),
      // optional and can be null or empty string
      description: Joi.string().allow('', null).optional(),
    }),
  ),
});

/**
 * Create waf schema
 */

const CreateWafSchema = () => base;

/**
 * Update waf schema
 */
const UpdateWafSchema = () =>
  base.keys({
    id: Joi.string().required().messages({
      'string.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    deleted: Joi.boolean().optional().messages({
      'boolean.base': errorConstMerge.NOT_BOOLEAN,
    }),
  });

module.exports = {
  CreateWafSchema,
  UpdateWafSchema,
};
