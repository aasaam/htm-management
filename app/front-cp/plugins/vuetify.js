import '@mdi/font/css/materialdesignicons.css';
import colors from 'vuetify/es5/util/colors';

// vuetify.options.js
export default function ({ app, store }) {
  return {
    icons: {
      iconfont: 'mdi',
    },
    rtl: app.$config.dir === 'rtl',

    theme: {
      dark: false,
      options: {
        customProperties: true,
      },
      themes: {
        light: {
          primary: colors.blue.darken2,
          secondary: colors.grey.darken1,
          accent: colors.shades.black,
          error: colors.red,
          warning: colors.amber.darken3,
          info: colors.blue.darken2,
          success: colors.green,
          background: colors.indigo.lighten5,
        },
        dark: {
          primary: colors.blue.darken2,
          secondary: colors.grey.darken1,
          accent: colors.shades.black,
          error: colors.red.accent3,
          warning: colors.amber.darken3,
          info: colors.blue.darken2,
          success: colors.green,
          background: '#121212',
        },
      },
    },
  };
}
