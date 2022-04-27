const constants = {
  Modern: 'modern',
  Intermediate: 'intermediate',
  Legacy: 'legacy',
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'TLSList',
  title: 'TLS Version',
  description: 'Possible values for tls version',
  type: 'string',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
