/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const moment = require('moment');

module.exports = function(date) {
  if ((date != null ? date.valid : undefined) !== true) { return; }
  if (date.normal == null) { return; }
  return moment(date.normal).format('YYYY-MM-DD');
};
