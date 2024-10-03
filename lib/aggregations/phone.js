const _ = require('lodash');

module.exports = function (phone) {
  if (phone != null && !phone.valid) { return; }
  return _.pick(phone, 'type', 'country_code', 'country_calling_code', 'area', 'exchange', 'is_tollfree');
};
