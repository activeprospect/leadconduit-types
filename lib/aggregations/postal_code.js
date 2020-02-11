const _ = require('lodash');

module.exports = function (postalCode) {
  if (postalCode != null && !postalCode.valid) { return; }
  return _.omit(postalCode, 'four', 'valid', 'raw');
};
