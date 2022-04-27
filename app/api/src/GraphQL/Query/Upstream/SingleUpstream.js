const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { id } = data;

  const { CreateUpstreamRepository } = container;

  checkToken(token, _, [
    userRoles.SUPERADMIN,
    userRoles.ADMIN,
    userRoles.VIEWER,
  ]);

  const upstream = await CreateUpstreamRepository.returnUpstreamById(id);

  return JSON.parse(JSON.stringify(upstream));
};
