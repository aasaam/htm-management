const constants = {
  HASHIP: 'HI',
  COOKIE: 'CO',
  ROUNDROBIN: 'RR',
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'LoadbalanceList',
  title: 'Load balance List',
  description: 'Load balance methods',
  type: 'string',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
