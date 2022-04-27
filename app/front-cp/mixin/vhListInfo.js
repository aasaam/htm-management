const listInfo = {
  data() {
    return {
      generalAction: {
        title: 'virtualhostList',
        addLink: 'virtualhost-add',
        editLink: '/virtualhost/edit',
        linkTitle: 'vhAdd',
        deletable: true,
        editable: true,
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
          width: '25%',
        },
        {
          text: this.$t('configMood'),
          value: 'advance',
          width: '28%',
          sortable: false,
        },
        {
          text: this.$t('status'),
          value: 'deleted',
          width: '20%',
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
          text: this.$t('vhAdd'),
          to: '/virtualhost/add',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('virtualhostList'),
          to: '/virtualhost/list',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
export default listInfo;
