const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class DeleteCertificate {
  constructor({ CertificateModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.CertificateModel = CertificateModel;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<string>}
   */
  async removeCert(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const cert = await this.CertificateModel.findById(id);

    cert.deleted = true;
    await cert.save();
    return cert.id;
  }
}

module.exports = DeleteCertificate;
