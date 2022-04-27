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
    // @ts-ignore
    await this.aclTemp.renderAllAclToFile();

    await this.certificate.writeSsl();
    await this.protection.renderAllProtectionToFile();
    await this.waf.renderAllWafToFile();
    await this.upstream.renderAllUpstreamToFile();
    await this.vh.renderAllVhToFile();

    return true;
  }
}

module.exports = GenerateAll;
