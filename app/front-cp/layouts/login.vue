<template>
  <v-app class="body_bg">
    <nuxt />
    <IntroFooter />
  </v-app>
</template>

<script>
const rtlLanguages = ['ar', 'dv', 'fa', 'he', 'ps', 'ur', 'yi'];

export default {
  middleware: ['direction'],
  head() {
    const i18nSeo = this.$nuxtI18nHead();
    return {
      htmlAttrs: {
        dir: rtlLanguages.includes(this.$i18n.locale) ? 'rtl' : 'ltr',
        lang: this.$i18n.locale,
        ...i18nSeo.htmlAttrs,
      },
    };
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
  },
  mounted() {
    const theme = localStorage.getItem('dark_theme');
    if (theme) {
      if (theme === 'true') {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    }

    if (this.$store.getters['user/auth/GET_AUTHENTICATED']) {
      this.$router.push(
        this.localeRoute({
          name: 'dashboard',
        }),
      );
    }
  },
};
</script>
