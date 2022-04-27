const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { id, name, fullChain, privateKey, chain, deleted } = data;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const { EditCertificateRepository } = container;

  return EditCertificateRepository.updateCertificate(
    id,
    name,
    fullChain,
    privateKey,
    chain,
    deleted,
  );
};
