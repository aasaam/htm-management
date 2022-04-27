import { extend } from 'vee-validate';

import validator from 'validator';

extend('url', {
  validate(value) {
    return validator.isURL(value, {
      protocols: ['http', 'https', 'ftp', 'ldap', 'ldaps'],
    });
  },
});
