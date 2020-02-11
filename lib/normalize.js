const _ = require('lodash');

const digit = /^\d+$/;

const normalize = function (obj) {
  if (obj == null) { return obj; }

  let rtn;
  if (obj instanceof String || obj instanceof Boolean || obj instanceof Number || obj instanceof Date) {
    const extendedKeys = Object.keys(obj).filter(key => !key.match(digit) && (typeof obj[key] !== 'function'));

    if (extendedKeys.length) {
      const normal =
        _.isDate(obj)
          ? new Date(obj.getTime())
          : obj.valueOf();
      rtn = { normal };
      for (const key of extendedKeys) {
        rtn[key] = normalize(obj[key]);
      }
      obj = rtn;
    } else if (!_.isDate(obj)) {
      obj = obj.valueOf();
    }
  } else if (obj instanceof Array) {
    obj = _.compact(obj.map((i) => {
      if (typeof i !== 'function') { return normalize(i); }
    })
    );
  } else if (typeof obj === 'object') {
    rtn = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'function') { continue; }
      rtn[key] = normalize(value);
    }
    obj = rtn;
  }

  return obj;
};

module.exports = normalize;
