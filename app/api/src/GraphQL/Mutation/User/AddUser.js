const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { email, password, roles, active } = data;

  const { CreateUserRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN]);

  const user = await CreateUserRepository.addUser(
    email,
    password,
    roles,
    active,
  );

  return {
    id: user.id,
    email: user.email,
  };
};
