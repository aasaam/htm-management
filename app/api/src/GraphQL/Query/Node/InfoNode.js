const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { ip, nodeToken, port } = data;
  const { StatusNodeRepository } = container;
  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  return StatusNodeRepository.checkNodeInfo(ip, port, nodeToken);
};
