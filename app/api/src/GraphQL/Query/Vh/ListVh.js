/* eslint-disable sonarjs/cognitive-complexity */

const { fieldsMap } = require('graphql-fields-list');
const { escapeRegExp } = require('lodash');
const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { args }, { container, token }, info) => {
  const { ListVhRepository } = container;

  checkToken(token, _, [
    userRoles.SUPERADMIN,
    userRoles.ADMIN,
    userRoles.VIEWER,
  ]);

  const query = {};
  let sort;
  let page;
  let limit;
  const docFieldsMap = fieldsMap(info).docs;
  const selected = docFieldsMap ? Object.keys(fieldsMap(info).docs) : ['_id'];

  if (args.filter) {
    // manipulate query
    Object.keys(args.filter).forEach((field) => {
      const m = field.match(/^([a-z0-9]+)_([a-z0-9]+)/i);
      const value = args.filter[`${field}`];
      if (m) {
        const type = m[1];
        const name = m[2];
        if (
          ['arrIn', 'arrAll', 'arrNin', 'dts', 'dte'].includes(type) &&
          !query[`${name}`]
        ) {
          query[`${name}`] = {};
        }
        if (type === 'arrIn') {
          query[`${name}`].$in = value;
        } else if (type === 'arrAll') {
          query[`${name}`].$all = value;
        } else if (type === 'arrNin') {
          query[`${name}`].$nin = value;
        } else if (type === 'eq') {
          query[`${name}`] = value;
        } else if (type === 're') {
          // eslint-disable-next-line security/detect-non-literal-regexp
          query[`${name}`] = new RegExp(escapeRegExp(value), 'i');
        } else if (type === 'dts') {
          query[`${name}`].$gte = new Date(value);
        } else if (type === 'dte') {
          query[`${name}`].$lte = new Date(value);
        }
      }
    });
  }
  if (args.sort) {
    sort = args.sort;
  }
  if (args.page) {
    page = args.page;
  }
  if (args.limit) {
    limit = args.limit;
  }

  return ListVhRepository.getVhList({
    query,
    selected,
    sort,
    page,
    limit,
  });
};
