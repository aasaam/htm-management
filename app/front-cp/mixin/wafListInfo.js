const listInfo = {
  data() {
    return {
      generalAction: {
        title: 'wafList',
        addLink: 'waf-add',
        editLink: '/waf/edit',
        linkTitle: 'wafAdd',
        deletable: true,
        editable: true,
      },
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('profileName'),
          sortable: false,
          value: 'profileName',
          type: 'text',
          width: '20%',
        },
        {
          text: this.$t('status'),
          value: 'deleted',
          width: '30%',
          sortable: false,
        },
        {
          text: this.$t('action'),
          value: 'actions',
          sortable: false,
          width: '10%',
          align: 'center',
        },
      ];
    },
    // Breadcrumb
    crumbs() {
      return [
        {
          text: this.$t('dashboard'),
          to: '/dashboard',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('wafAdd'),
          to: '/waf/add',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('wafList'),
          to: '/waf/list',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
export default listInfo;
