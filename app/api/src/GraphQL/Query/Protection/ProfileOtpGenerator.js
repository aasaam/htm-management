const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, __, { container, token }) => {
  const { ProtectionOtpGenerateRepository } = container;
  checkToken(token, _, [
    userRoles.SUPERADMIN,
    userRoles.ADMIN,
    userRoles.VIEWER,
  ]);

  return ProtectionOtpGenerateRepository.generateNewOtp();
};
