const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { name, fullChain, privateKey, chain } = data;

  const { CreateCertificateRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  return CreateCertificateRepository.addCertificate(
    name,
    fullChain,
    privateKey,
    chain,
  );
};
