const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

/**
 * BASE acl schema
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
    }),

  mood: Joi.number().required().min(0).max(1).messages({
    'number.min': errorConstMerge.MOOD_MIN,
    'number.max': errorConstMerge.MOOD_MAX,
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),

  list: Joi.array().required().items(Joi.string().ip()).messages({
    'string.ip': errorConstMerge.INVALID_IP,
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
});

/**
 * Create acl schema
 */

const CreateAclSchema = () => base;

/**
 * Update acl schema
 */
const UpdateAclSchema = () =>
  base.keys({
    id: Joi.string().required().messages({
      'string.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    deleted: Joi.boolean().default(false).messages({
      'boolean.base': errorConstMerge.NOT_BOOLEAN,
    }),
  });

module.exports = {
  CreateAclSchema,
  UpdateAclSchema,
};
