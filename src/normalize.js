/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let normalize;
const _ = require('lodash');

const digit = /^\d+$/;

module.exports = (normalize = function(obj) {
  let key, rtn;
  if (obj == null) { return obj; }

  if (obj instanceof String || obj instanceof Boolean || obj instanceof Number || obj instanceof Date) {
    const extendedKeys = Object.keys(obj).filter(key => !key.match(digit) && (typeof obj[key] !== 'function'));

    if (extendedKeys.length) {
      const normal =
        _.isDate(obj) ?
          new Date(obj.getTime())
        :
          obj.valueOf();
      rtn = { normal };
      for (key of Array.from(extendedKeys)) {
        rtn[key] = normalize(obj[key]);
      }
      obj = rtn;
    } else if (!_.isDate(obj)) {
      obj = obj.valueOf();
    }
  } else if (obj instanceof Array) {
    obj = _.compact(obj.map(function(i) {
      if (typeof i !== 'function') { return normalize(i); }
    })
    );
  } else if (typeof obj === 'object') {
    rtn = {};
    for (key in obj) {
      const value = obj[key];
      if (typeof value === 'function') { continue; }
      rtn[key] = normalize(value);
    }
    obj = rtn;
  }

  return obj;
});
