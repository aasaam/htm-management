const listInfo = {
  data() {
    return {
      generalAction: {
        title: 'nodeList',
        addLink: 'node-add',
        editLink: '/node/edit',
        linkTitle: 'nodeAdd',
        deletable: true,
        editable: true,
      },
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('ip'),
          sortable: false,
          value: 'ip',
          type: 'text',
          width: '14%',
        },
        {
          text: this.$t('port'),
          value: 'port',
          sortable: false,
          type: 'number',
          width: '10%',
        },
        {
          text: this.$t('tlsVersion'),
          value: 'tlsVersion',
          sortable: false,
          type: 'box',
          width: '15%',
          items: [
            {
              name: this.$t('modern'),
              value: 'modern',
            },
            {
              name: this.$t('intermediate'),
              value: 'intermediate',
            },
            {
              name: this.$t('legacy'),
              value: 'legacy',
            },
          ],
        },
        {
          text: this.$t('status'),
          value: 'deleted',
          width: '8%',
          sortable: false,
        },
        {
          text: this.$t('action'),
          value: 'actions',
          sortable: false,
          width: '16%',
          align: 'center',
        },
      ];
    },
    crumbs() {
      return [
        {
          text: this.$t('dashboard'),
          to: '/dashboard',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('nodeAdd'),
          to: '/node/add',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('nodeList'),
          to: '/node/list',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
export default listInfo;
