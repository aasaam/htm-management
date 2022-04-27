import { extend } from 'vee-validate';
import validator from 'validator';
import { domainPort } from '@/custom-validation/constant';

extend('upstreamServer', {
  // ip or ipPort or domainPort
  validate(value) {
    return validator.isIP(value) || domainPort.test(value);
  },
});
