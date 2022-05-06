const dateFormatter = {
  data() {
    return {
      currentLocale: this.$i18n.locale ? this.$i18n.locale : 'en-US',
    };
  },
  methods: {
    formatDateTime({
      value,
      options = {
        dateStyle: 'long',
        timeStyle: 'short',
      },
    }) {
      return new Intl.DateTimeFormat(this.currentLocale, options).format(
        new Date(value),
      );
    },

    diffDateTime({
      value,
      options = {
        style: 'narrow',
      },
    }) {
      const rtf1 = new Intl.RelativeTimeFormat(this.currentLocale, options);
      // how many days left
      const diff = Math.floor(
        (new Date(value) - new Date()) / 1000 / 60 / 60 / 24,
      );
      return rtf1.format(diff, 'day');
    },
  },
};
export default dateFormatter;
