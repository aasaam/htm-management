const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { ip, nodeToken, tlsVersion, port, nodeId } = data;

  const { CreateNodeRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const node = await CreateNodeRepository.addNode(
    ip,
    nodeToken,
    tlsVersion,
    port,
    nodeId,
  );
  return node.id;
};
