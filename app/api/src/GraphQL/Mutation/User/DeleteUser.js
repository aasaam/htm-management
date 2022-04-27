const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const { id } = data;
  const { DeleteUserRepository } = container;

  const u = await DeleteUserRepository.removeUserById(id);
  return {
    id: u.id,
    email: u.email,
  };
};
