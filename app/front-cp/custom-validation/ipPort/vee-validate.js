import { extend } from 'vee-validate';
import validator from 'validator';

extend('ipPort', {
  validate(value) {
    return validator.isIP(value) || validator.isIP(value.split(':')[0]);
  },
});
