const { schema: CountryCodes } = require('./CountryCodes');
const { schema: Modules } = require('./Modules');
const { schema: LanguageCodes } = require('./LanguageCodes');
const { schema: LogLevels } = require('./LogLevels');
const { schema: UserActions } = require('./UserActions');
const { schema: UserRoles } = require('./UserRoles');
const { schema: UserSignIn } = require('./UserShema/UserSignIn');
const { schema: UserResetPassword } = require('./UserResetPassword');
const { schema: WafMode } = require('./WafMode');

module.exports = [
  CountryCodes,
  Modules,
  LanguageCodes,
  LogLevels,
  UserActions,
  UserRoles,
  UserSignIn,
  UserResetPassword,
  WafMode,
];
