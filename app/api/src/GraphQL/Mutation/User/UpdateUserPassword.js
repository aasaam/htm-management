const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { id, currentPassword, newPassword } = data;
  const { UpdatePasswordRepository } = container;

  checkToken(token, _, [
    userRoles.SUPERADMIN,
    userRoles.VIEWER,
    userRoles.ADMIN,
  ]);

  const isAdmin = token.roles.includes(userRoles.SUPERADMIN);

  return UpdatePasswordRepository.updateUserCurrentPassword(
    id,
    currentPassword,
    newPassword,
    isAdmin,
  );
};
