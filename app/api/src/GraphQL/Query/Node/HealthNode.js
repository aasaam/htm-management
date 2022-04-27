const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { ip, nodeToken, tlsVersion, port, nodeId } = data;
  const { StatusNodeRepository } = container;
  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  return StatusNodeRepository.checkHealth(
    ip,
    nodeToken,
    port,
    tlsVersion,
    nodeId,
  );
};
