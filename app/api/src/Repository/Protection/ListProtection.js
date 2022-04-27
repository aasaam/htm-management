class ListProtection {
  constructor({ ProtectionModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.ProtectionModel = ProtectionModel;

    this.sortFields = ['_id', 'name'];
  }

  async getProtectionList({
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
    const paginate = await this.ProtectionModel.paginate(query, options);

    return {
      docs: paginate.docs,
      totalDocs: paginate.totalDocs,
      limit: paginate.limit,
      pagingCounter: paginate.pagingCounter,
      totalPages: paginate.totalPages,
      page: paginate.page,
    };
  }

  async findAllProtection() {
    return this.ProtectionModel.find({ deleted: false });
  }

  async findAllProtectionBackup() {
    return this.ProtectionModel.find();
  }

  async rmProCollection() {
    return this.ProtectionModel.deleteMany({});
  }

  async insertProCollection(protection) {
    await this.ProtectionModel.insertMany(protection, { ordered: false });
  }
}

module.exports = ListProtection;
