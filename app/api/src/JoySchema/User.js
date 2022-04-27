const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list: userRoles } = require('../Schema/UserRoles');

/**
 * BASE user schema
 */
const base = Joi.object().keys({
  email: Joi.string().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
});

/**
 * Create user schema
 */

const CreateUserSchema = () =>
  base.keys({
    password: Joi.string().required().min(7).max(32).messages({
      'string.min': errorConstMerge.PASSWORD_MIN,
      'string.max': errorConstMerge.PASSWORD_MAX,
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),

    roles: Joi.array()
      .items(Joi.string().valid(...userRoles))
      .required()
      .messages({
        'array.items': errorConstMerge.ISREQUIRE_FIELD,
        'array.required': errorConstMerge.ISREQUIRE_FIELD,
      }),

    active: Joi.boolean().required().messages({
      'boolean.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
  });

/**
 * Update user schema For Superadmin
 */
const UpdateUserSchemaSA = () =>
  base.keys({
    id: Joi.string().required().messages({
      'string.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    roles: Joi.array()
      .items(Joi.string().valid(...userRoles))
      .required()
      .messages({
        'array.items': errorConstMerge.ISREQUIRE_FIELD,
        'array.required': errorConstMerge.ISREQUIRE_FIELD,
      }),

    active: Joi.boolean().required().messages({
      'boolean.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
  });

/**
 * Update user schema For Members
 */
const UpdateUserSchemaME = () =>
  base.keys({
    id: Joi.string().required().messages({
      'string.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
  });

/**
 * Update Member Password
 */
const UpdateMemberPassword = () =>
  Joi.object({
    id: Joi.string().required().messages({
      'string.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    currentPassword: Joi.string().optional().min(7).max(32).messages({
      'string.min': errorConstMerge.PASSWORD_MIN,
      'string.max': errorConstMerge.PASSWORD_MAX,
      'string.pattern.base': errorConstMerge.INVALID_PASSWORD,
    }),
    newPassword: Joi.string().required().min(7).max(32).messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
      'string.min': errorConstMerge.PASSWORD_MIN,
      'string.max': errorConstMerge.PASSWORD_MAX,
      'string.pattern.base': errorConstMerge.INVALID_PASSWORD,
    }),
  });

module.exports = {
  CreateUserSchema,
  UpdateUserSchemaSA,
  UpdateUserSchemaME,
  UpdateMemberPassword,
};
