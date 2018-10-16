import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
  customProperties: true,
  iconfont: 'fa',
  theme: {
    primary: colors.blueGrey.darken1,
    secondary: colors.blueGrey.lighten3,
    accent: colors.blueGrey.darken4,
    error: colors.red.darken4,
    warning: colors.yellow.accent4,
    info: colors.blue.accent4,
    success: colors.green.accent4
  }
});
