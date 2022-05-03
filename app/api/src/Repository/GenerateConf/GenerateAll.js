const util = require('util');
const exec = util.promisify(require('child_process').exec);

class GenerateAll {
  constructor({
    AclTemplateRepository,
    CreateCertificateRepository,
    ProtectionTemplateRepository,
    WafTemplateRepository,
    UpstreamTemplateRepository,
    VhTemplateRepository,
  }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */

    this.aclTemp = AclTemplateRepository;
    this.certificate = CreateCertificateRepository;
    this.protection = ProtectionTemplateRepository;
    this.waf = WafTemplateRepository;
    this.upstream = UpstreamTemplateRepository;
    this.vh = VhTemplateRepository;
  }

  /**
   *
   * @returns {Promise<Boolean>}
   */
  async generateAllConfFile() {
    const { stderr } = await exec(
      [
        `cd /app/api/`,
        `rm -rf addon`,
        `mkdir addon`,
        `cd addon`,
        `mkdir acl`,
        `mkdir ssl`,
        `mkdir includes`,
        `mkdir protection`,
        `mkdir naxi`,
        `mkdir upstream`,
        `mkdir sites-enabled`,
        `mkdir gomplates`,
        `chmod 777 -R /app/api/addon`,
        `cd gomplates && mkdir sites-enabled`,
      ].join(' && '),
    );

    if (stderr) {
      throw new Error(`${stderr}`);
    }

    // @ts-ignore
    await this.aclTemp.renderAllAclToFile();

    await this.certificate.writeSsl();
    await this.protection.renderAllProtectionToFile();
    await this.waf.renderAllWafToFile();
    await this.upstream.renderAllUpstreamToFile();
    const a = await this.vh.renderAllVhToFile();

    console.log(a);

    return true;
  }
}

module.exports = GenerateAll;
