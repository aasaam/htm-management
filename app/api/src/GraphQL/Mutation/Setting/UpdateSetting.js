const { ErrorWithProps } = require('mercurius').default;

module.exports = async (_, { data }, { container, token }) => {
  const { name, value } = data;

  if (!token || token.roles.includes('VI')) {
    throw new ErrorWithProps('Forbidden.', {
      statusCode: 403,
    });
  }
  const { ActionSettingRepository } = container;

  return ActionSettingRepository.findConfigAndUpdate(name, value);
};
