const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, __, { container, token }) => {
  const { StatusNodeRepository } = container;
  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  return StatusNodeRepository.nodeRestart();
};
