import { extend } from 'vee-validate';

// Used for ACL,VH,UPSTREAM,PROTECTIONS
extend('profileNameValidation', {
  validate(value) {
    return /^[a-zA-Z][a-zA-Z0-9_]{3,31}$/.test(value);
  },
});
