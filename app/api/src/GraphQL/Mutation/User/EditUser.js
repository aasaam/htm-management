const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');
const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { id, email, roles, active } = data;

  checkToken(token, _, [
    userRoles.SUPERADMIN,
    userRoles.ADMIN,
    userRoles.VIEWER,
  ]);

  const { EditUserRepository } = container;

  let result;
  if (token.roles.includes(userRoles.SUPERADMIN)) {
    result = await EditUserRepository.editUserBySuperadmin(
      id,
      email,
      roles,
      active,
    );
  } else {
    if (id !== token.uid) {
      throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
        statusCode: 403,
      });
    }
    result = await EditUserRepository.editUserByMember(id, email);
  }

  return result;
};
