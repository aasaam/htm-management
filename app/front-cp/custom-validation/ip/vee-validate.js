import { extend } from 'vee-validate';
import validator from 'validator';

extend('ip', {
  validate(value) {
    return validator.isIP(value);
  },
});
