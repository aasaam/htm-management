const mongoose = require('mongoose');
const validator = require('validator').default;
const { authenticator } = require('otplib');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;
const { list: CountryCodes } = require('../Schema/CountryCodes');
const ChallengeTypeList = require('../Schema/ChallengeType');
const CaptchaDifficulty = require('../Schema/CaptchaDifficulty');

const protectionSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      require: true,
      unique: true,
      validate: /^[a-zA-Z][a-zA-Z0-9]{3,31}$/,
    },

    //  Start ACL property for protection
    country: {
      type: [Schema.Types.String],
      require: false,
      enum: CountryCodes,
    },

    cidr: [
      {
        require: false,
        type: Schema.Types.String,
        validate: {
          validator(c) {
            return validator.isIPRange(c, 4);
          },
        },
      },
    ],

    asn: [
      {
        require: false,
        type: Schema.Types.String,
        validate: {
          validator(c) {
            return c >= 0 && c <= 4294967295;
          },
        },
      },
    ],

    asnRange: [
      {
        require: false,
        type: Schema.Types.String,
        validate: {
          validator(c) {
            const m = c.match(/(^[0-9]+)-([0-9]+)$/);
            if (m) {
              let [, n1, n2] = m;
              n1 = parseInt(n1, 10);
              n2 = parseInt(n2, 10);
              if (n1 < n2 && n1 >= 0 && n2 <= 4294967295) {
                return true;
              }
            }
            return false;
          },
        },
      },
    ],

    clientToken: {
      type: Schema.Types.Mixed,
      require: false,
    },

    // Global properties
    // fa -an
    protectionDefaultLang: {
      type: Schema.Types.String,
      require: true,
      default: 'fa',
    },

    protectionSupportedLang: {
      type: [Schema.Types.String],
      require: true,
      default: ['fa', 'en'],
    },

    protectionI18nOrgTitle: {
      type: Schema.Types.Mixed,
      require: true,
    },

    protectionConfigTtl: {
      type: Schema.Types.Number,
      min: 3600,
      default: 28800,
      max: 604800,
    },

    protectionConfigTimeout: {
      require: false,
      type: Schema.Types.Number,
      default: 600,
      min: 300,
      max: 1800,
    },

    protectionConfigWaitToSolve: {
      require: false,
      type: Schema.Types.Number,
      default: 3,
      min: 2,
      max: 180,
    },

    // Challenge type
    challenge: {
      require: true,
      type: Schema.Types.String,
      enum: ChallengeTypeList.list,
    },

    // Challenge -> Captcha properties
    captchaDifficulty: {
      require: false,
      default: 'medium',
      type: Schema.Types.String,
      enum: CaptchaDifficulty.list,
    },

    // Challenge -> TOTP properties
    totpSecret: {
      type: Schema.Types.String,
      required: false,
    },

    // Challenge -> LDAP properties
    ldapUri: {
      type: Schema.Types.String,
      required: false,
    },

    ldapRoUsername: {
      type: Schema.Types.String,
      required: false,
    },

    ldapRoPassword: {
      type: Schema.Types.String,
      required: false,
    },

    ldapBaseDn: {
      type: Schema.Types.String,
      required: false,
    },

    ldapFilter: {
      type: Schema.Types.String,
      required: false,
    },

    ldapAttributes: {
      type: [Schema.Types.String],
      required: false,
      default: ['dn'],
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

protectionSchema.methods = {
  /**
   * @param {String} input
   * @returns {Boolean}
   */
  verifyTOtp(input) {
    return authenticator.check(input, this.totpSecret);
  },
  /**
   * @returns {void}
   */
  setNewOtpSecret() {
    this.totpSecret = authenticator.generateSecret();
    return this.totpSecret;
  },
};

protectionSchema.plugin(mongoosePaginate);

const ProtectionModel = mongoose.model('Protection', protectionSchema);

module.exports = () => ProtectionModel;
