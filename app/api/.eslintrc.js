module.exports = {
  root: true,
  globals: {
    __stack: true,
    __line: true,
    __debugPoint: true,
  },
  env: {
    commonjs: true,
    es6: true,
    browser: false,
    node: true,
  },
  plugins: ['sonarjs', 'node', 'security', 'prettier'],
  extends: [
    'plugin:node/recommended',
    'plugin:sonarjs/recommended',
    'plugin:security/recommended',
    'airbnb',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
};
