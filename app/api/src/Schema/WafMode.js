const constants = {
  DISABLE: 'disable',
  LEARN: 'learning',
  DEBUG: 'debug',
  ACTIVE: 'active',
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'WafMode',
  title: 'Waf Mode',
  description: 'Possible values for Waf Mode',
  type: 'string',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
