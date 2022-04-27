const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { id, profileName, list, deleted } = data;

  const { EditWafRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  return EditWafRepository.updateWaf({
    id,
    profileName,
    list,
    deleted,
  });
};
