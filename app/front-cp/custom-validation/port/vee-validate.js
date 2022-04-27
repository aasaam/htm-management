import { extend } from 'vee-validate';
import validator from 'validator';

extend('port', {
  validate(value) {
    return validator.isPort(value);
  },
});
