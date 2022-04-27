const { to } = require('await-to-js');

const listQueryBuilder = {
  methods: {
    async callMeFetch(fetchListRoute) {
      // ** sort mood calculation
      const sortCalc = {};
      if (this.options.sortDesc['0'] === true) {
        sortCalc[this.options.sortBy['0']] = 1;
      } else if (this.options.sortDesc['0'] === false) {
        sortCalc[this.options.sortBy['0']] = -1;
      }

      // ** options and filter calculation
      const pm = {
        page: this.options.page,
        limit: this.options.itemsPerPage,
        filter: {},
        sort: sortCalc,
      };
      // eslint-disable-next-line array-callback-return
      Object.keys(this.params).map((key) => {
        pm.filter[key] = this.params[key];
      });

      const [, data] = await to(
        this.$store.dispatch(fetchListRoute, {
          args: pm,
        }),
      );

      if (data) {
        this.dataList = data.docs;
        this.total = data.totalDocs;
        this.options.pageStop = data.totalPages;
      }
    },
  },
};
export default listQueryBuilder;
