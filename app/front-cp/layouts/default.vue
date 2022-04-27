<template>
  <v-app app :style="{ background: $vuetify.theme.themes[theme].background }">
    <Nav />
    <AppBar />

    <v-main>
      <v-container fluid>
        <div class="d-md-none pt-4">
          <ApplyConfig />
        </div>
        <nuxt />
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import globalApplyConfig from '@/mixin/globalApply';
const rtlLanguages = ['ar', 'dv', 'fa', 'he', 'ps', 'ur', 'yi'];

export default {
  mixins: [globalApplyConfig],
  middleware: ['check-token', 'acl', 'direction'],
  data() {
    return {
      timer: null,
    };
  },
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
    this.$vuetify.theme.dark = this.$store.state.helper.darkMode;
  },
  created() {
    this.run();
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    run() {
      this.timer = setInterval(() => {
        this.$store.dispatch('user/auth/refreshToken');
      }, 3 * 60 * 1000);
    },
  },
};
</script>
