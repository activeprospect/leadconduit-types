const _ = require('lodash');

module.exports = function (range) {
  if (!range.valid) { return; }
  return _.pick(range, 'normal', 'min', 'max', 'avg', 'mid');
};
