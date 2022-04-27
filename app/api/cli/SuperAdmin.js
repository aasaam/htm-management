const chalk = require('chalk');

// eslint-disable-next-line no-unused-vars
const { log } = console;

module.exports = {
  name: 'super-admin',
  description: 'Create first super admin.',
  /**
   * @param {import('awilix').AwilixContainer} container
   * @param {Object} args
   */
  // eslint-disable-next-line no-unused-vars
  async runAction(container) {
    /** @type {import('../src/Repository/User/CreateUser')} */

    const createUserRepo = container.resolve('CreateUserRepository');
    const Config = container.resolve('Config');

    const exist = await createUserRepo.isUserExist({
      email: Config.ASM_DEFAULT_ADMIN_EMAIL,
    });

    if (exist) {
      const result = await createUserRepo.generatePasswordAndSet(
        Config.ASM_DEFAULT_ADMIN_EMAIL,
      );

      log(
        `🦊 Email is: ${chalk.white.bgRed.bold(
          Config.ASM_DEFAULT_ADMIN_EMAIL,
        )}`,
      );
      log(`🔒 Generated Password is: ${chalk.white.bgBlue.bold(result)}`);
    } else {
      const newPassword = await createUserRepo.generateStrongPassword();

      const result = await createUserRepo.addUser(
        Config.ASM_DEFAULT_ADMIN_EMAIL,
        newPassword,
        ['SA'],
        true,
      );

      if (result) {
        log(`${chalk.yellow.bold('🔔 New user created: 🔔')}`);
        log('\n');
        log(
          `🦊 Email is: ${chalk.white.bgRed.bold(
            Config.ASM_DEFAULT_ADMIN_EMAIL,
          )}`,
        );
        log(`🔒 Password is: ${chalk.white.bgBlue.bold(newPassword)}`);
      }
    }
  },
};
