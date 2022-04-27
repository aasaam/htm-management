const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { id, ip, nodeToken, tlsVersion, port, nodeId, deleted } = data;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const { EditNodeRepository } = container;

  return EditNodeRepository.updateNode(
    id,
    ip,
    nodeToken,
    tlsVersion,
    port,
    nodeId,
    deleted,
  );
};
