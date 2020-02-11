const moment = require('moment');

module.exports = function (date) {
  if (date != null && !date.valid) { return; }
  if (!date.normal) { return; }
  return moment(date.normal).format('YYYY-MM-DD');
};
