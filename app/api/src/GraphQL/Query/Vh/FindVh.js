const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { domain } = data;

  const { BulkUpdateVhRepository } = container;
  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const { count, sample } = await BulkUpdateVhRepository.findVHbyDomain(domain);

  return { count, sample };
};
