class ListAcl {
  constructor({ AclModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.AclModel = AclModel;

    this.sortFields = ['_id'];
  }

  async getAclList({
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
    const paginate = await this.AclModel.paginate(query, options);

    return {
      docs: paginate.docs,
      totalDocs: paginate.totalDocs,
      limit: paginate.limit,
      pagingCounter: paginate.pagingCounter,
      totalPages: paginate.totalPages,
      page: paginate.page,
    };
  }

  async findAllAcl() {
    return this.AclModel.find({ deleted: false });
  }

  async findAllAclBackup() {
    return this.AclModel.find({});
  }

  async findAllAclById() {
    return this.AclModel.find({ deleted: false }).distinct('_id');
  }

  async rmAclCollection() {
    return this.AclModel.deleteMany({});
  }

  async insertAclCollection(acl) {
    await this.AclModel.insertMany(acl, { ordered: false });
  }
}

module.exports = ListAcl;
