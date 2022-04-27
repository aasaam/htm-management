/** @type {import('json-schema').JSONSchema4} */
const schema = {
  $id: 'UserSignIn',
  title: 'User Sign In',
  description: 'Sign in user data',
  type: 'object',
  properties: {
    username: {
      type: 'string',
      example: 'signuser',
      description: 'Username',
    },
    email: {
      type: 'string',
      example: 'aabi@gmail.com',
    },
    password: {
      type: 'string',
      example: 'onCHGni7i7EfdF$@',
    },
    otp: {
      type: 'string',
      example: '',
    },
    rememberMe: {
      type: 'boolean',
      default: false,
    },
  },
  anyOf: [
    { required: ['username', 'password'] },
    { required: ['username', 'otp'] },
    { required: ['email', 'password'] },
    { required: ['email', 'otp'] },
  ],
};

module.exports = {
  schema,
};
