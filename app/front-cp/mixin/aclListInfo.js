const listInfo = {
  data() {
    return {
      generalAction: {
        title: 'aclList',
        addLink: 'acl-add',
        editLink: '/acl/edit',
        linkTitle: 'aclAdd',
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
        },
        {
          text: this.$t('mood'),
          value: 'mood',
          sortable: false,
          type: 'box',
          width: '25%',
          items: [
            {
              name: this.$t('blackList'),
              value: 1,
            },
            {
              name: this.$t('whiteList'),
              value: 0,
            },
          ],
        },
        {
          text: this.$t('status'),
          value: 'deleted',
          sortable: false,
        },
        {
          text: this.$t('action'),
          value: 'actions',
          sortable: false,
          align: 'center',
          width: '15%',
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
          text: this.$t('aclAdd'),
          to: '/acl/add',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('aclList'),
          to: '/acl/list',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
export default listInfo;
