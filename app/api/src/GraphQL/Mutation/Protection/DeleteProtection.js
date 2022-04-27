const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { id } = data;
  const { DeleteProtectionRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  return DeleteProtectionRepository.removeProtection(id);
};
