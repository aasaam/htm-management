import { extend } from 'vee-validate';

extend('wafzero', {
  validate(value) {
    if (value.length > 1 && value.includes('0')) {
      return false;
    } else {
      return true;
    }
  },
});
