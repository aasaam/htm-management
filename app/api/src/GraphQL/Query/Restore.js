const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../Schema/UserRoles');
const checkToken = require('../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { file } = data;

  checkToken(token, _, [
    userRoles.SUPERADMIN,
    userRoles.ADMIN,
    userRoles.VIEWER,
  ]);
  const { RestoreBackupRepository } = container;

  try {
    return await RestoreBackupRepository.uploadBackup(file);
  } catch (e) {
    throw new ErrorWithProps(e.message, {
      statusCode: e.extensions ? e.extensions.statusCode : 500,
    });
  }
};
