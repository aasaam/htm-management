const listInfo = {
  data() {
    return {
      generalAction: {
        title: 'protectionList',
        addLink: 'protection-add',
        editLink: '/protection/edit',
        linkTitle: 'protectionAdd',
        deletable: true,
        editable: false,
      },
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          sortable: true,
          value: 'name',
          type: 'text',
        },
        {
          text: this.$t('challenge'),
          value: 'challenge',
          sortable: false,
          type: 'box',
          items: [
            {
              name: this.$t('challengeJs'),
              value: 'js',
            },
            {
              name: this.$t('challengeCaptcha'),
              value: 'captcha',
            },
            {
              name: this.$t('challengeTotp'),
              value: 'totp',
            },
            {
              name: this.$t('challengeLdap'),
              value: 'ldap',
            },

            {
              name: this.$t('challengeBlock'),
              value: 'block',
            },
          ],
        },
        {
          text: this.$t('status'),
          value: 'deleted',
          width: '15%',
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
          text: this.$t('protectionAdd'),
          to: '/protection/add',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('protectionList'),
          to: '/protection/list',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
export default listInfo;
