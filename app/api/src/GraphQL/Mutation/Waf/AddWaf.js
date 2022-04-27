const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { profileName, list } = data;

  const { CreateWafRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const waf = await CreateWafRepository.addWafProfile(profileName, list);
  return waf.id;
};
