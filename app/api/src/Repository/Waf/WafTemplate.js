/* eslint-disable no-plusplus */
/* eslint-disable security/detect-child-process */
const { writeFile } = require('fs').promises;
const nunjucks = require('nunjucks');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class WafTemplate {
  constructor({ ListWafRepository }) {
    this.wafList = ListWafRepository;

    this.nunjucks = nunjucks.configure('/app/api/src/templates', {
      trimBlocks: true,
    });
  }

  async render(wafModel) {
    return new Promise((resolve) => {
      nunjucks.render(
        'waf.j2',
        {
          waf: JSON.parse(JSON.stringify(wafModel)),
        },
        (e, config) => {
          resolve(config);
        },
      );
    });
  }

  async renderToFile(wafModel) {
    const result = await this.render(wafModel);
    await writeFile(`/app/api/addon/naxi/rules_${wafModel.id}.conf`, result, {
      encoding: 'utf8',
      mode: 0o644,
    });
  }

  async renderAllWafToFile() {
    const filePath = '/app/api/addon/naxi';
    const wafs = await this.wafList.findAllWaf();
    const { stdout, stderr } = await exec(`rm -rf ${filePath}/*.conf`);
    if (stderr) {
      throw new Error(`${stderr}`);
    }
    const promises = [];

    if (stdout === '' && wafs.length > 0) {
      for (let index = 0; index < wafs.length; index++) {
        promises.push(this.renderToFile(wafs[`${index}`]));
      }
      await Promise.all(promises);
    }
  }
}

module.exports = WafTemplate;
