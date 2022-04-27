class ListNode {
  constructor({ NodeModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.NodeModel = NodeModel;

    this.sortFields = ['_id'];
  }

  async getNodeList({
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
    const paginate = await this.NodeModel.paginate(query, options);

    return {
      docs: paginate.docs,
      totalDocs: paginate.totalDocs,
      limit: paginate.limit,
      pagingCounter: paginate.pagingCounter,
      totalPages: paginate.totalPages,
      page: paginate.page,
    };
  }

  async findAllNodeBackup() {
    return this.NodeModel.find();
  }

  async rmNodeCollection() {
    return this.NodeModel.deleteMany({});
  }

  async insertNodeCollection(node) {
    await this.NodeModel.insertMany(node, { ordered: false });
  }
}

module.exports = ListNode;
