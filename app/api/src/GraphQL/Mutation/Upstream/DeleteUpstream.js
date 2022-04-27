const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { id } = data;
  const { DeleteUpstreamRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  return DeleteUpstreamRepository.removeUpstream(id);
};
