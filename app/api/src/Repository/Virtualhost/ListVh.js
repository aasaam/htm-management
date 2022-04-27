class ListVh {
  constructor({ ServerModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.ServerModel = ServerModel;

    this.sortFields = ['_id'];
  }

  async getVhList({
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
    options.populate = {
      path: 'certificate',
      select: ['name', 'id'],
    };

    // @ts-ignore
    const paginate = await this.ServerModel.paginate(query, options);

    return {
      docs: paginate.docs,
      totalDocs: paginate.totalDocs,
      limit: paginate.limit,
      pagingCounter: paginate.pagingCounter,
      totalPages: paginate.totalPages,
      page: paginate.page,
    };
  }

  async findAllVh() {
    return this.ServerModel.find({ deleted: false }).populate([
      {
        path: 'location',
        populate: {
          path: 'upstreamProfile',
          model: 'Upstream',
          select: ['name', 'id'],
        },
      },
      {
        path: 'location',
        populate: {
          path: 'aclProfile',
          model: 'Acl',
          select: ['name', 'id'],
        },
      },
    ]);
  }

  async findSingleForRender(id) {
    return this.ServerModel.findOne({ deleted: false, id }).populate([
      {
        path: 'location',
        populate: {
          path: 'upstreamProfile',
          model: 'Upstream',
          select: ['name', 'id'],
        },
      },
      {
        path: 'location',
        populate: {
          path: 'aclProfile',
          model: 'Acl',
          select: ['name', 'id'],
        },
      },
    ]);
  }

  async findAllVhBackup() {
    return this.ServerModel.find();
  }

  async rmVhCollection() {
    return this.ServerModel.deleteMany({});
  }

  async insertVhCollection(vh) {
    await this.ServerModel.insertMany(vh, { ordered: false });
  }
}

module.exports = ListVh;
