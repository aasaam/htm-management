const listInfo = {
  data() {
    return {
      generalAction: {
        title: 'certificateList',
        addLink: 'certificate-add',
        editLink: '/certificate/edit',
        linkTitle: 'certificateAdd',
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
          text: this.$t('issuer'),
          value: 'issuer',
          sortable: false,
          type: 'text',
        },
        {
          text: this.$t('sans'),
          value: 'sans',
          sortable: false,
          type: 'Arrtext',
        },
        {
          text: this.$t('endDate'),
          value: 'notAfter',
          width: '25%',
          sortable: false,
          type: 'daterange',
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
          width: '14%',
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
          text: this.$t('certificateAdd'),
          to: '/certificate/add',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('certificateList'),
          to: '/certificate/list',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
export default listInfo;
