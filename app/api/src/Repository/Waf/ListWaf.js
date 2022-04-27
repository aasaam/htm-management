class ListWaf {
  constructor({ WafModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.WafModel = WafModel;

    this.sortFields = ['_id'];
  }

  async getWafList({
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
    const paginate = await this.WafModel.paginate(query, options);

    return {
      docs: paginate.docs,
      totalDocs: paginate.totalDocs,
      limit: paginate.limit,
      pagingCounter: paginate.pagingCounter,
      totalPages: paginate.totalPages,
      page: paginate.page,
    };
  }

  async findAllWaf() {
    return this.WafModel.find({ deleted: false });
  }

  async findAllWafBackup() {
    return this.WafModel.find();
  }

  async rmWafCollection() {
    return this.WafModel.deleteMany({});
  }

  async insertWafCollection(waf) {
    await this.WafModel.insertMany(waf, { ordered: false });
  }
}

module.exports = ListWaf;
