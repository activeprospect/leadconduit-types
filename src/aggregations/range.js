/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('lodash');

module.exports = function(range) {
  if (range.valid !== true) { return; }
  return _.pick(range, 'normal', 'min', 'max', 'avg', 'mid');
};
