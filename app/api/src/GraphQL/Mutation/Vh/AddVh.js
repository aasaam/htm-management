const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { CreateVhRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const vh = await CreateVhRepository.addVh(data);

  return vh.id;
};
