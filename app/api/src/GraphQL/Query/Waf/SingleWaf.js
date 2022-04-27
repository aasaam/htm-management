const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { id } = data;

  checkToken(token, _, [
    userRoles.SUPERADMIN,
    userRoles.ADMIN,
    userRoles.VIEWER,
  ]);
  const { CreateWafRepository } = container;
  const waf = await CreateWafRepository.returnWafById(id);

  return JSON.parse(JSON.stringify(waf));
};
