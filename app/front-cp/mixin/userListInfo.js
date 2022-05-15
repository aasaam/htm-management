const listInfo = {
  data() {
    return {
      generalAction: {
        title: 'userList',
        addLink: 'user-add',
        editLink: '/user/edit',
        linkTitle: 'userAdd',
        deletable: true,
        editable: true,
      },
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('email'),
          sortable: false,
          value: 'email',
          type: 'text',
        },
        {
          text: this.$t('roles'),
          sortable: false,
          value: 'roles',
          type: 'box',
          items: [
            {
              name: this.$t('superAdmin'),
              value: 'SA',
            },
            {
              name: this.$t('admin'),
              value: 'AD',
            },
            {
              name: this.$t('viewer'),
              value: 'VI',
            },
          ],
        },
        {
          text: this.$t('lastLogin'),
          sortable: false,
          value: 'lastLogin',
        },
        {
          text: this.$t('active'),
          sortable: false,
          value: 'active',
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
    crumbs() {
      return [
        {
          text: this.$t('dashboard'),
          to: '/dashboard',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('userAdd'),
          to: '/user/add',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('userList'),
          to: '/user/list',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
export default listInfo;
