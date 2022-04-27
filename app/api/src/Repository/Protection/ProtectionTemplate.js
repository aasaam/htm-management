/* eslint-disable no-plusplus */
/* eslint-disable security/detect-child-process */
const { writeFile } = require('fs').promises;
const nunjucks = require('nunjucks');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class ProtectionTemplate {
  constructor({ ListProtectionRepository }) {
    this.protectionList = ListProtectionRepository;

    this.nunjucks = nunjucks.configure('/app/api/src/templates', {
      trimBlocks: true,
    });
  }

  async render(protectionModel) {
    const clonePro = JSON.parse(JSON.stringify(protectionModel));
    return new Promise((resolve) => {
      nunjucks.render(
        'protection.j2',
        {
          protection: clonePro,
        },
        (e, config) => {
          if (e) {
            throw new Error(e);
          }
          resolve(config);
        },
      );
    });
  }

  async renderToFile(protectionModel) {
    const result = await this.render(protectionModel);
    await writeFile(
      `/app/api/addon/protection/protection_${protectionModel.id}.conf`,
      result,
      { encoding: 'utf8' },
    );
  }

  async renderAllProtectionToFile() {
    const filePath = '/app/api/addon/protection';
    const protections = await this.protectionList.findAllProtection();
    const { stdout, stderr } = await exec(`rm -rf ${filePath}/*.conf`);
    if (stderr) {
      throw new Error(`${stderr}`);
    }
    const promises = [];

    if (stdout === '' && protections.length > 0) {
      for (let index = 0; index < protections.length; index++) {
        promises.push(this.renderToFile(protections[`${index}`]));
      }
      await Promise.all(promises);
    }
  }
}

module.exports = ProtectionTemplate;
