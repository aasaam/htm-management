const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');
const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { data }, { container, token }) => {
  const { ProfileUserRepository } = container;
  const { id } = data;

  if (!token) {
    throw new ErrorWithProps(errorConstMerge.NOT_ALLOWED, {
      statusCode: 405,
    });
  }

  if (!token.roles.includes(userRoles.SUPERADMIN) && id !== token.uid) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  return ProfileUserRepository.profileUserData(id);
};
