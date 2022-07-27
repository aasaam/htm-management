const { ErrorWithProps } = require('mercurius').default;
const { escapeRegExp } = require('lodash');
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class BulkUpdateVh {
  constructor({ ServerModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.ServerModel = ServerModel;
    this.ApplySetting = ApplySettingRepository;
  }

  /**
   *
   * @param {String} domain
   * @returns {Promise<object>}
   */
  async findVHbyDomain(domain) {
    if (!domain) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 422,
      });
    }

    const listDoc = await this.ServerModel.find({
      host: {
        // eslint-disable-next-line security/detect-non-literal-regexp
        $regex: new RegExp(escapeRegExp(domain), 'i'),
      },
      advance: 0,
      deleted: false,
    });

    if (!listDoc.length) {
      return { count: 0, sample: [] };
    }

    const sample = listDoc.slice(0, 5).map((doc) => ({
      id: doc.id,
      name: doc.name,
      host: doc.host,
    }));

    const vhIds = listDoc.map((doc) => doc.id);

    return { count: listDoc.length, vh: vhIds, sample };
  }

  /**
   *
   * @param {*} param0
   * @returns
   */
  async bulkUpdateVh({ domain, certId }) {
    if (!certId || !domain) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 422,
      });
    }
    const { vh } = await this.findVHbyDomain(domain);

    const updateMany = await this.ServerModel.updateMany(
      { _id: { $in: vh } },
      { $set: { certificate: certId } },
      { multi: true },
    );

    // Update changeTime
    await this.ApplySetting.updateChangeTime();
    return updateMany.modifiedCount;
  }
}

module.exports = BulkUpdateVh;
