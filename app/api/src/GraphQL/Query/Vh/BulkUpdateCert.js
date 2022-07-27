const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { domain, certificate } = data;

  const { BulkUpdateVhRepository } = container;
  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  return BulkUpdateVhRepository.bulkUpdateVh({
    domain,
    certId: certificate,
  });
};
