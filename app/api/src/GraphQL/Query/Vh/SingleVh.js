const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { id } = data;

  const { CreateVhRepository } = container;
  checkToken(token, _, [
    userRoles.SUPERADMIN,
    userRoles.ADMIN,
    userRoles.VIEWER,
  ]);

  const vh = await CreateVhRepository.returnVhById(id);

  return JSON.parse(JSON.stringify(vh));
};
