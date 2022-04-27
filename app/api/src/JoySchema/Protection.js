const Joi = require('joi');
const validator = require('validator').default;
const { list: countryCode } = require('../Schema/CountryCodes');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list: challengeTypeList } = require('../Schema/ChallengeType');
const { list: CaptchaDifficulty } = require('../Schema/CaptchaDifficulty');

// Custom validation
const isCidr = (value, helpers) => {
  if (validator.isIPRange(value, 4)) {
    return true;
  }

  return helpers.error('string.custom');
};

/**
 * BASE Protection schema
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

  country: Joi.array()
    .items(Joi.string().valid(...countryCode))
    .optional()
    .messages({
      'array.includes': errorConstMerge.COUNTRY_INVALID,
    }),

  cidr: Joi.array().items(
    Joi.string().custom(isCidr).messages({
      'string.custom': errorConstMerge.INVALID_CIDR,
    }),
  ),

  asn: Joi.array().items(
    Joi.number().integer().min(0).max(4294967295).messages({
      'number.min': errorConstMerge.ASN_MIN,
      'number.max': errorConstMerge.ASN_MAX,
    }),
  ),

  asnRange: Joi.array().items(
    Joi.string()
      .regex(/^[0-9]+-[0-9]+$/)
      .messages({
        'string.regex.base': errorConstMerge.INVALID_ASN_RANGE,
      }),
  ),

  clientToken: Joi.object().optional().allow(null, ''),

  // global property
  protectionDefaultLang: Joi.string().valid('en', 'fa').required().messages({
    'string.valid': errorConstMerge.DEFAULT_LANGUAGE_INVALID,
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
  protectionSupportedLang: Joi.array()
    .items(Joi.string().valid('fa', 'en'))
    .optional()
    .messages({
      'array.includes': errorConstMerge.INVALID_PROTECTION_SUPPORTED_LANG,
    }),

  protectionI18nOrgTitle: Joi.object().allow(null, '').required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),

  protectionConfigTtl: Joi.number()
    .min(3600)
    .max(604800)
    .default(28800)
    .messages({
      'number.min': errorConstMerge.TTL_MIN,
      'number.max': errorConstMerge.TTL_MAX,
    }),

  protectionConfigTimeout: Joi.number()
    .min(300)
    .max(1800)
    .default(600)
    .messages({
      'number.min': errorConstMerge.TIMEOUT_MIN,
      'number.max': errorConstMerge.TIMEOUT_MAX,
    }),

  protectionConfigWaitToSolve: Joi.number()
    .min(2)
    .max(180)
    .default(3)
    .messages({
      'number.min': errorConstMerge.CONFIG_WAIT_TO_SOLVE_MIN,
      'number.max': errorConstMerge.CONFIG_WAIT_TO_SOLVE_MAX,
    }),

  challenge: Joi.string()
    .valid(...challengeTypeList)
    .required()
    .messages({
      'string.valid': errorConstMerge.CHALLENGE_INVALID,
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),

  captchaDifficulty: Joi.string()
    .valid(...CaptchaDifficulty)
    .when('challenge', {
      is: ['captcha', 'ldap'],
      then: Joi.required(),
    }),

  ldapUri: Joi.string()
    .uri()
    .when('challenge', {
      is: 'ldap',
      then: Joi.required(),
    })
    .messages({
      'string.uri': errorConstMerge.LDAP_URI_INVALID,
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),

  ldapRoUsername: Joi.string()
    .when('challenge', {
      is: 'ldap',
      then: Joi.required(),
    })
    .messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),

  ldapRoPassword: Joi.string()
    .when('challenge', {
      is: 'ldap',
      then: Joi.required(),
    })
    .messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),

  ldapBaseDn: Joi.string()
    .when('challenge', {
      is: 'ldap',
      then: Joi.required(),
    })
    .messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),

  ldapFilter: Joi.string().when('challenge', {
    is: 'ldap',
    then: Joi.required().messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
  }),

  ldapAttributes: Joi.array()
    .items(Joi.string().allow(''))
    .when('challenge', {
      is: 'ldap',
      then: Joi.required().messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'array.includes': errorConstMerge.LDAP_ATTRIBUTES_INVALID,
      }),
    }),
});

/**
 * Create Protection schema
 */

const CreateProtectionSchema = () => base;

/**
 * Update Protection schema
 */
const UpdateProtectionSchema = () =>
  base.keys({
    id: Joi.string().required().messages({
      'string.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    deleted: Joi.boolean().optional().messages({
      'boolean.base': errorConstMerge.NOT_BOOLEAN,
    }),
  });

module.exports = {
  CreateProtectionSchema,
  UpdateProtectionSchema,
};
