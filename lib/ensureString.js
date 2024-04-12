const { result } = require('lodash');

// input data parsed by these types are expected to be strings;
// this is used to ensure (i.e., to handle objects, etc.)
module.exports = function (data) {
  return result(data, 'raw.toString', data.toString());
};
