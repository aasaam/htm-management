const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { name } = data;

  const { ActionSettingRepository } = container;
  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  return ActionSettingRepository.getNginxConf(name);
};
