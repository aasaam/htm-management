const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { OtpGeneratorRepository } = container;
  const { id, currentPassword } = data;

  checkToken(token, _, [
    userRoles.SUPERADMIN,
    userRoles.VIEWER,
    userRoles.ADMIN,
  ]);

  if (token.roles.includes(userRoles.SUPERADMIN)) {
    return OtpGeneratorRepository.generateNewOtpSecret({ id, admin: true });
  }

  return OtpGeneratorRepository.generateNewOtpSecret({ id, currentPassword });
};
