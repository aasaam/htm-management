const constants = {
  TOTP: 'totp',
  JS: 'js',
  CAPTCHA: 'captcha',
  BLOCK: 'block',
  LDAP: 'ldap',
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'LoadbalanceList',
  title: 'Challenge Type',
  description: 'Challenge Type List',
  type: 'string',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
