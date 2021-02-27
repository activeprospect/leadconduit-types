const _ = require('lodash');
const normalize = require('../normalize');

const parse = function (string) {
  if (string == null) { return string; }

  let object;
  if (_.isPlainObject(string)) {
    object = _.cloneDeep(string);
  } else if (_.isString(string)) {
    // peek at the string to see if it looks like JSON
    if (string.match(/^\s*{/)) {
      object = parseObject(string);
    }
  }

  object = object || { valid: false };
  if (object.valid == null) { object.valid = true; }
  object.raw = string.raw != null ? string.raw : string;
  return object;
};

const parseObject = function (string) {
  try {
    return JSON.parse(string);
  } catch (err) {
    return { valid: false };
  }
};

module.exports = {
  parse,
  components: [],
  maskable: false,
  operators: [],
  examples: [
    '{"property_1":"abc","property_2":"def"}'
  ].map(parse).map(normalize)
};
