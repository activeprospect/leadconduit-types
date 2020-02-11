/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('lodash');

module.exports = function(postalCode) {
  if ((postalCode != null ? postalCode.valid : undefined) !== true) { return; }
  return _.omit(postalCode, 'four', 'valid', 'raw');
};
