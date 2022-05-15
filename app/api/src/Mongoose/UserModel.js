const mongoose = require('mongoose');
const validator = require('validator').default;
const argon2 = require('argon2');

const { authenticator } = require('otplib');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const UserRoles = require('../Schema/UserRoles');

const userSchema = new Schema(
  {
    email: {
      type: Schema.Types.String,
      unique: true,
      sparse: true,
      validate: {
        /**
         * @param {String} c
         */
        validator(c) {
          return validator.isEmail(c);
        },
      },
    },

    password: {
      type: Schema.Types.String,
    },

    roles: {
      type: [Schema.Types.String],
      default: [UserRoles.constants.REGISTERED],
      enum: UserRoles.list,
    },

    active: {
      type: Boolean,
      required: true,
      default: true,
    },

    deleted: {
      type: Boolean,
      default: false,
    },

    otpSecret: {
      type: Schema.Types.String,
      required: false,
      default() {
        return authenticator.generateSecret(12);
      },
    },

    lastLogin: {
      type: Date,
      default: null,
      nullable: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods = {
  /**
   * @param {String} input
   * @returns {Promise<Boolean>}
   */
  async verifyOtp(input) {
    return authenticator.check(input, this.otpSecret);
  },

  /**
   * @returns {void}
   */
  setNewOtpSecret() {
    this.otpSecret = authenticator.generateSecret(12);
    return this.otpSecret;
  },

  /**
   * @param {String} rawPassword
   * @returns {Promise<Boolean>}
   */
  async setPassword(rawPassword) {
    return new Promise((res) => {
      argon2.hash(rawPassword).then((hash) => {
        this.password = hash;
        res(true);
      });
    });
  },

  /**
   * @param {String} rawPassword
   * @returns {Promise<Boolean>}
   */
  async verifyPassword(rawPassword) {
    return new Promise((resolve) => {
      argon2
        .verify(this.password, rawPassword)
        .then((valid) => {
          resolve(valid);
        })
        .catch(() => {
          resolve(false);
        });
    });
  },

  /**
   * @param {String} email
   * @returns {Boolean}
   */
  setEmail(email) {
    if (validator.isEmail(email)) {
      this.email = validator.normalizeEmail(email);
      return true;
    }
    return false;
  },
};

userSchema.plugin(mongoosePaginate);

const UserModel = mongoose.model('User', userSchema);

module.exports = () => UserModel;
