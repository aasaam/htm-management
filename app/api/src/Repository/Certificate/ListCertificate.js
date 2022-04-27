class ListCertificate {
  constructor({ CertificateModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.CertificateModel = CertificateModel;

    this.sortFields = ['_id'];
  }

  /**
   *
   * @description Get all certificates list
   *
   */
  async getCertList({
    query = { deleted: false },

    select = [],
    sort = { _id: -1 },
    page = 1,
    limit = 10,
  }) {
    const options = {
      page: 1,
      limit: 10,
      sort: {},
      select,
    };

    if (page && Number.isInteger(page) && page >= 1) {
      options.page = page;
    }

    Object.keys(sort).forEach((field) => {
      const mode = sort[`${field}`];
      if (this.sortFields.includes(field)) {
        options.sort[`${field}`] = mode;
      }
    });

    if (limit && Number.isInteger(limit) && limit >= 1 && limit <= 100) {
      options.limit = limit;
    }

    // @ts-ignore
    const paginate = await this.CertificateModel.paginate(query, options);

    return {
      docs: paginate.docs,
      totalDocs: paginate.totalDocs,
      limit: paginate.limit,
      pagingCounter: paginate.pagingCounter,
      totalPages: paginate.totalPages,
      page: paginate.page,
    };
  }

  /**
   * @description for create backup
   *
   */
  async findAllCertBackup() {
    return this.CertificateModel.find();
  }

  /**
   * @description delete certificate collection
   * @returns {Promise<void>}
   */
  async rmCertCollection() {
    return this.CertificateModel.deleteMany({});
  }

  /**
   * @description insert certificate
   * @param {*} cert
   */
  async insertCertCollection(cert) {
    await this.CertificateModel.insertMany(cert, { ordered: false });
  }
}

module.exports = ListCertificate;
