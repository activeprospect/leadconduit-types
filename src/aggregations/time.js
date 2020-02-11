/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
module.exports = function(time) {
  if ((time != null ? time.valid : undefined) !== true) { return; }
  return (time.normal != null ? time.normal.toISOString() : undefined);
};
