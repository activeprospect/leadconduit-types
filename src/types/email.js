/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const parseEmail = require('email-addresses').parseOneAddress;
const parseDomain = require('domain-name-parser');
const normalize = require('../normalize');
const {handleFreemailValidation} = require('@activeprospect/freemail');

const stripRegex = /^\s+|\s+$/g;

const parse = function(string) {
  let parsed;
  const addr = parseEmail(string);
  const freemailValidationData = handleFreemailValidation(string.raw != null ? string.raw : string);

  if (addr != null) {
    parsed = new String(string.toLowerCase().replace(stripRegex, ''));
    parsed.raw = string.raw != null ? string.raw : string;
    parsed.user = addr.local;
    parsed.is_free = freemailValidationData.isFree;
    parsed.is_disposable = freemailValidationData.isDisposable;

    const domain = parseDomain(addr.domain);
    parsed.domain = addr.domain;
    parsed.host = addr.domain.replace(new RegExp(`\.${domain.tld}$`), '');
    parsed.tld = domain.tld;
    parsed.valid = true;
  } else {
    parsed = new String(string);
    parsed.raw = string.raw != null ? string.raw : string;
    parsed.valid = false;
  }

  return parsed;
};


const components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' },
  { name: 'user', type: 'string', description: 'User name (everything to the left of @)' },
  { name: 'domain', type: 'string', description: 'Domain name (everything to the right of @)' },
  { name: 'host', type: 'string', description: 'Domain excluding top level domain' },
  { name: 'tld', type: 'string', description: 'Top level domain (.com, .net, etc)' },
  { name: 'is_free', type: 'boolean', description: 'Whether or not the email is from a free domain (ex: gmail, yahoo, etc)' },
  { name: 'is_disposable', type: 'boolean', description: 'Whether or not the email is disposable' }
];


module.exports = {
  parse,
  components,
  maskable: false,
  operators: [
    'is equal to',
    'is not equal to',
    'is blank',
    'is not blank',
    'format is valid',
    'format is invalid',
    'includes',
    'does not include',
    'is included in',
    'is not included in',
    'matches pattern',
    'does not match pattern'
  ],
  examples: [
    'mikejones32@gmail.com',
    'rcampbell1976@outlook.com',
    'janets@somecompany.biz'
  ].map(parse).map(normalize)
};
