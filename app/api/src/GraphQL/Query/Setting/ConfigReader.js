const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { name } = data;

  const { ApplySettingRepository } = container;
  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  return ApplySettingRepository.getSettingStatus(name);
};
