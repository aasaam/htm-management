class ListUpstream {
  constructor({ UpstreamModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.UpstreamModel = UpstreamModel;

    this.sortFields = ['_id'];
  }

  async getUpstreamList({
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
    const paginate = await this.UpstreamModel.paginate(query, options);

    return {
      docs: paginate.docs,
      totalDocs: paginate.totalDocs,
      limit: paginate.limit,
      pagingCounter: paginate.pagingCounter,
      totalPages: paginate.totalPages,
      page: paginate.page,
    };
  }

  async findAllUpstreamById() {
    return this.UpstreamModel.find({ deleted: false }).distinct('_id');
  }

  async findAllUpstream() {
    return this.UpstreamModel.find({ deleted: false });
  }

  async findAllUpstreamBackup() {
    return this.UpstreamModel.find();
  }

  async rmUpstrCollection() {
    return this.UpstreamModel.deleteMany({});
  }

  async insertUpstrCollection(upstream) {
    await this.UpstreamModel.insertMany(upstream, { ordered: false });
  }
}

module.exports = ListUpstream;
