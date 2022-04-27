/* eslint-disable camelcase */

import Vue from 'vue';
import '@/custom-validation/validators';
import {
  extend,
  configure,
  setInteractionMode,
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate';
import {
  required,
  email,
  min,
  max,
  length,
  numeric,
  alpha,
  alpha_spaces,
  alpha_dash,
  alpha_num,
  regex,
  digits,
} from 'vee-validate/dist/rules';

extend('required', required);
extend('email', email);
extend('min', min);
extend('max', max);
extend('length', length);
extend('numeric', numeric);
extend('alpha', alpha);
extend('digits', digits);
extend('alpha_spaces', alpha_spaces);
extend('alpha_dash', alpha_dash);
extend('alpha_num', alpha_num);
extend('regex', regex);

setInteractionMode('eager');

export default function VeeValidatePlugin({ app }) {
  configure({
    defaultMessage: (_, values) =>
      app.i18n.t(`validations.${values._rule_}`, values),
  });
}

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
