const listInfo = {
  data() {
    return {
      generalAction: {
        title: 'upstreamList',
        addLink: 'upstream-add',
        editLink: '/upstream/edit',
        linkTitle: 'upstreamAdd',
        deletable: true,
      },
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          sortable: false,
          value: 'name',
          type: 'text',
          width: '30%',
        },
        {
          text: this.$t('loadBalanceMethod'),
          value: 'loadBalanceMethod',
          sortable: false,
          type: 'box',
          width: '20%',
          items: [
            {
              name: this.$t('hashIp'),
              value: 'HI',
            },
            {
              name: this.$t('cookie'),
              value: 'CO',
            },
            {
              name: this.$t('roundRobin'),
              value: 'RR',
            },
          ],
        },
        {
          text: this.$t('configMood'),
          value: 'advance',
          sortable: false,
          width: '15%',
        },
        {
          text: this.$t('status'),
          value: 'deleted',
          width: '10%',
          sortable: false,
        },
        {
          text: this.$t('action'),
          value: 'actions',
          sortable: false,
          width: '20%',
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
          text: this.$t('upstreamAdd'),
          to: '/upstream/add',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('upstreamList'),
          to: '/upstream/list',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
export default listInfo;
