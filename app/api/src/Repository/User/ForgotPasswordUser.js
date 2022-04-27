const { ErrorWithProps } = require('mercurius').default;
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class ForgotPasswordUser {
  constructor({ UserModel, Config, Redis }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.UserModel = UserModel;
    this.Redis = Redis;
    this.Config = Config;
  }

  async sendForgotPasswordCode(email) {
    if (!email) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_EMAIL, {
        statusCode: 422,
      });
    }

    const smtpUri = this.Config.ASM_SMTP_URI;
    const sender = this.Config.ASM_SMTP_SENDER;

    if (!smtpUri || !sender) {
      throw new ErrorWithProps(errorConstMerge.NOT_SET, {
        statusCode: 501,
      });
    }

    const user = await this.UserModel.findOne({
      email,
      active: true,
    });

    let success = '0';
    const hashToken = crypto
      .randomBytes(32)
      .toString('base64')
      .replace(/[^a-z0-9]/gi, '')
      .substring(0, 16);

    if (user) {
      const { _id } = user;
      const redis = await this.Redis.getRedis();
      await redis.set(`forget_password:${hashToken}`, _id, 'EX', 300);

      const messageOption = {
        from: `${sender}`,
        to: `${email}`,
        subject: 'Forget password code',
        text: `Your code is: ${hashToken}`,
        html: `<p>Your code is: <code>${hashToken}</code></p>`,
      };

      return new Promise((resolve, reject) => {
        const transport = nodemailer.createTransport(`${smtpUri}`);
        transport.sendMail(messageOption, (err) => {
          if (err) {
            success = '0';
            transport.close();
            reject(
              new ErrorWithProps(errorConstMerge.SMTP_ERROR, {
                statusCode: 500,
              }),
            );
          } else {
            success = '1';
            resolve(this.Config.ASM_PUBLIC_APP_TEST ? hashToken : success);
            transport.close();
          }
        });
      });
    }

    return success;
  }
}

module.exports = ForgotPasswordUser;
