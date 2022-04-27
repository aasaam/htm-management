/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-object-injection */
/* eslint-disable class-methods-use-this */
/* eslint-disable security/detect-child-process */
/* eslint-disable no-plusplus */

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class EditCertificate {
  constructor({
    CertificateModel,
    CreateCertificateRepository,
    ApplySettingRepository,
  }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.CertificateModel = CertificateModel;
    this.CCerRepository = CreateCertificateRepository;
    this.ApplySetting = ApplySettingRepository;
  }

  /**
   *
   * @param {String} id
   * @param {String} name
   * @param {String} fullChain
   * @param {String} privateKey
   * @param {String} chain
   * @param {String} deleted
   * @returns
   */

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async updateCertificate(id, name, fullChain, privateKey, chain, deleted) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    let validForSave = false;
    const cert = await this.CCerRepository.findCertificateById(id);

    if (name) {
      cert.name = name;
      validForSave = true;
    }
    cert.deleted = deleted;

    if (fullChain && privateKey && chain) {
      const bufferData = {};
      bufferData.certificateBuff = await this.CCerRepository.decodeBase64(
        fullChain,
      );
      bufferData.privateKeyBuff = await this.CCerRepository.decodeBase64(
        privateKey,
      );
      bufferData.chainBuff = await this.CCerRepository.decodeBase64(chain);

      const { stderr } = await exec(
        `cd /tmp && rm -rf edit-data && mkdir edit-data`,
      );
      if (stderr) {
        throw new Error('Error while creating folder');
      }
      fs.access('/tmp', (err) => {
        if (err) {
          throw new Error(`${err}`);
        }

        Object.keys(bufferData).forEach((item) => {
          fs.writeFile(
            `/tmp/edit-data/${item}.pem`,
            bufferData[item],
            (error) => {
              if (error) {
                throw new Error('Error accrued while creating pem file.');
              }
            },
          );
        });
      });

      if (bufferData.certificateBuff) {
        const promises = [];
        const str = bufferData.certificateBuff.toString();
        const splittedCertResult = this.CCerRepository.splitCert(str);
        const splittedNumber = splittedCertResult.length;

        for (let index = 0; index < splittedNumber; index++) {
          promises.push(
            this.CCerRepository.processCertificate(
              splittedCertResult[index],
              index,
            ),
          );
        }
        const result = (await Promise.all(promises)).filter((r) => !!r);
        if (result) {
          validForSave = true;
          const info = result['0'].data;
          cert.issuer = info.issuer.organization;
          cert.sans = info.sans;
          cert.not_before = info.not_before;
          cert.notAfter = info.not_after;
          cert.sigalg = info.sigalg;
        }
      }
      const isVerifyFullChain = await this.verifyFullChain();

      const isVerifyPrivKey = await this.verifyPrivKey();
      if (isVerifyFullChain === isVerifyPrivKey) {
        validForSave = true;
        cert.fullChain = bufferData.certificateBuff;
        cert.privateKey = bufferData.privateKeyBuff;
        cert.chain = bufferData.chainBuff;
      } else {
        throw new ErrorWithProps(errorConstMerge.NOT_MATCH_KEYCHAIN, {
          statusCode: 400,
        });
      }
    } else if ((fullChain && !privateKey) || (privateKey && !fullChain)) {
      // fullChain & privatekey
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 400,
      });
    }

    if (validForSave) {
      await cert.save();
    }

    // Update changeTime
    await this.ApplySetting.updateChangeTime();
    return cert.id;
  }

  /**
   *
   * @returns{Promise}
   */
  async verifyFullChain() {
    const filePath = `/tmp/edit-data/certificateBuff.pem`;
    const { stdout } = await exec(
      `openssl x509 -noout -pubkey -in ${filePath}`,
    );
    if (stdout) {
      return stdout;
    }
    return false;
  }

  /**
   *
   * @returns {Promise}
   */
  async verifyPrivKey() {
    const filePath = `/tmp/edit-data/privateKeyBuff.pem`;
    const { stdout } = await exec(`openssl pkey -pubout -in ${filePath}`);
    if (stdout) {
      return stdout;
    }
    return false;
  }
}

module.exports = EditCertificate;
