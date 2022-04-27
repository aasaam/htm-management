const chalk = require('chalk');

// eslint-disable-next-line no-unused-vars
const { log } = console;

module.exports = {
  name: 'generate-config',
  description: 'Init default config',
  /**
   * @param {import('awilix').AwilixContainer} container
   */
  // eslint-disable-next-line no-unused-vars
  async runAction(container) {
    const setting = container.resolve('ActionSettingRepository');
    const conf = container.resolve('ApplySettingRepository');

    const isValid = await setting.initNginxConf();
    const isValid2 = await conf.initializeTimeConfig();
    if (isValid && isValid2) {
      log(
        `${chalk.bgGreen.bold(' Success ')}   ${chalk.bgGreenBright(
          ' Init default config success ',
        )}\n${chalk.green.bold(
          '✅ Successfully nginx.conf and ApplyTime config generated. ✅',
        )}`,
      );
    } else {
      log(
        `${chalk.bgRed.bold(' Error ')}   ${chalk.bgRedBright(
          ' Init default config error ',
        )}\n${chalk.red.bold(
          '⛔️ Failed to generate nginx.conf and ApplyTime config. ⛔️',
        )}`,
      );
    }
  },
};
