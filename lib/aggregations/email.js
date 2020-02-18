const _ = require('lodash');

module.exports = function (email) {
  if (email != null && !email.valid) { return; }
  return _.pick(email, 'domain', 'host', 'tld');
};
