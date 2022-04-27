const constants = {
  MEDIUM: 'medium',
  EASY: 'easy',
  HARD: 'hard',
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'CaptchaDifficultyList',
  title: 'Captcha Difficulty',
  description: 'Captcha Difficulty List',
  type: 'string',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
