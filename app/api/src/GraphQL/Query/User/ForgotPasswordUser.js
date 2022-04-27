module.exports = async (_, { data }, { container }) => {
  const { ForgotPasswordUserRepository } = container;
  const { email } = data;

  return ForgotPasswordUserRepository.sendForgotPasswordCode(email);
};
