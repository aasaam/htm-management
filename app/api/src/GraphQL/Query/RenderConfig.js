const { constants: userRoles } = require('../../Schema/UserRoles');
const checkToken = require('../../Utils/CheckToken');

// eslint-disable-next-line consistent-return
module.exports = async (_, { data }, { container, token }) => {
  const { type, dataModel, id } = data;

  checkToken(token, _, [
    userRoles.SUPERADMIN,
    userRoles.ADMIN,
    userRoles.VIEWER,
  ]);

  const {
    UpstreamTemplateRepository,
    VhTemplateRepository,
    AclTemplateRepository,
    ProtectionTemplateRepository,
    CreateProtectionRepository,
    WafTemplateRepository,
  } = container;

  if (type === 'upstream') {
    return UpstreamTemplateRepository.render(dataModel);
  }
  if (type === 'vh') {
    // console.log(dataModel);
    return VhTemplateRepository.render(dataModel, true);
  }
  if (type === 'acl') {
    return AclTemplateRepository.render(dataModel);
  }
  if (type === 'protection') {
    const r = await CreateProtectionRepository.returnProtectionById(id);
    if (r) {
      return ProtectionTemplateRepository.render(r);
    }
  }
  if (type === 'waf') {
    return WafTemplateRepository.render(dataModel);
  }
};
