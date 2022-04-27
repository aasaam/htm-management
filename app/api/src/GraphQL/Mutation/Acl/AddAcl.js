const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { name, mood, list } = data;

  const { CreateAclRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const acl = await CreateAclRepository.addAcl(name, mood, list);
  return acl.id;
};
