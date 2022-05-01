import { I18N, localeProjectInfo } from './i18n/config';
import manifest from './manifest/config.json';

const headLinks = [
  { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  {
    rel: 'manifest',
    hid: 'manifest',
    href: `/_cp/manifest-${localeProjectInfo.lang}.json`,
  },
];

Object.keys(manifest.icons).forEach((name) => {
  const size = manifest.icons[name];
  headLinks.push({
    rel: 'shortcut icon',
    sizes: `${size}x${size}`,
    href: `/_cp/_icons/${name}.png`,
  });
});

export default {
  ssr: false,

  router: {
    base: '/_cp',
    mode: 'hash',
  },
  server: {
    port: parseInt(process.env.ASM_FRONT_CP_PORT, 10) || 3000,
    host: '0.0.0.0',
  },

  publicRuntimeConfig: {
    dir: localeProjectInfo.dir || 'rtl',
    lang: localeProjectInfo.lang || 'fa',
    supportedLocales: localeProjectInfo.supportedLocales || ['fa', 'en'],
  },
  target: 'static',

  head: {
    titleTemplate: `%s - ${localeProjectInfo.projectName}`,
    title: localeProjectInfo.loading,
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui',
      },
      {
        hid: 'description',
        name: 'description',
        content: localeProjectInfo.projectDescription,
      },
      {
        hid: 'robots',
        name: 'robots',
        content: 'noindex,nofollow',
      },
    ],
    link: headLinks,
  },

  css: ['@aasaam/noto-font/dist/font-face.css', '~/assets/main.scss'],
  plugins: [
    { src: '~/plugins/vuex-persist.js', ssr: false },
    '~/plugins/vee-validate.js',
  ],

  components: {
    dirs: [
      '~/components',
      '~/components/User',
      '~/components/Structure',
      '~/components/User/Edit',
      '~/components/Global',
      '~/components/Helper',
      '~/components/Dashboard',
      '~/components/Certificate',
      '~/components/Node',
      '~/components/Node/NodeStuff',
      '~/components/Protection',
      '~/components/Protection/ProtectionStuff',
      '~/components/Setting',
      '~/components/Upstream',
      '~/components/Vh',
      '~/components/Vh/VhStuff',
    ],
  },
  buildModules: [
    ['@nuxtjs/eslint-module', { cache: false }],
    '@nuxtjs/vuetify',
  ],

  modules: ['@nuxtjs/axios', ['@nuxtjs/i18n', I18N]],
  axios: {
    baseURL: '',
  },
  loading: {
    color: process.env.ASM_BUILD_NUXT_LOADING_COLOR
      ? process.env.ASM_BUILD_NUXT_LOADING_COLOR
      : '#00bcd4',
    failedColor: process.env.ASM_BUILD_NUXT_LOADING_FAILED_COLOR
      ? process.env.ASM_BUILD_NUXT_LOADING_FAILED_COLOR
      : '#ff9800',
    height: '8px',
    rtl: localeProjectInfo.dir === 'rtl',
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    optionsPath: './plugins/vuetify.js',
    defaultAssets: false,
    treeShake: true,
  },
  // generate: {
  //   fallback: '404.html',
  // },

  build: {
    transpile: ['vuex-persist'],
    extend(config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.devtool = 'source-map';
      }
    },
  },
};
