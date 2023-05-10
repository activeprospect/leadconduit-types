const _ = require('lodash');
const normalize = require('./normalize');
const aggregate = require('./aggregate');
const types = require('./types');
const digit = /^\d+$/;

const typeNames = Object.keys(types);

module.exports.names = typeNames;

for (const name in types) {
  module.exports[name] = types[name];
}

module.exports.normalize = normalize;
module.exports.aggregate = aggregate;

module.exports.parse = function (name, value, req) {
  // Look up the type of the field, based on its name
  const fieldType = typeNames.includes(name)
    ? module.exports[name]
    : undefined;

  if (fieldType != null && value != null) {
    if (fieldType.components && fieldType.components.length && value.valid != null) {
      // the value already has components, so parsing isn't necessary
      return value;
    } else {
      // call its parse function and set the new value
      return fieldType.parse(value, req);
    }
  } else {
    return value;
  }
};

const mask = function (obj, doMask = false) {
  if (obj == null) { return obj; }
  if (obj instanceof Array) {
    obj = obj.map(i => mask(i, doMask));
  } else if (typeof obj === 'object') {
    if ((obj.masked === false) && (obj instanceof String || obj instanceof Boolean || obj instanceof Number || obj instanceof Date)) {
      const str = new String(mask(obj.toString(), true));
      for (const key in obj) {
        const value = obj[key];
        if (key === 'valid') {
          str[key] = value;
        } else {
          if (!key.match(digit)) { str[key] = mask(value, true); }
        }
      }
      str.masked = true;
      obj = str;
    } else {
      for (const key in obj) {
        const value = obj[key];
        if (key === 'valid') { continue; }
        obj[key] = mask(value, (obj.masked != null) || doMask);
      }
      if (obj.masked != null) { obj.masked = true; }
    }
  } else if (_.isString(obj) || _.isNumber(obj) || _.isDate(obj)) {
    if (doMask) { obj = obj.toString().replace(/./g, '*'); }
  } else if (_.isBoolean(obj)) {
    if (doMask) { obj = '*'; }
  } else if (_.isFunction(obj)) {
    // no op
  } else {
    throw `Don't know how to mask ${obj}`; // eslint-disable-line no-throw-literal
  }
  return obj;
};

module.exports.mask = mask;

const clone = function (vars) {
  if (_.isArray(vars)) {
    return vars.map(v => clone(v));
  } else if (vars instanceof String) {
    const str = new String(vars.toString());
    for (const name in vars) {
      const value = vars[name];
      if (!name.match(digit)) { str[name] = value; }
    }
    return str;
  } else if (vars instanceof Number || vars instanceof Boolean || vars instanceof Date) {
    const obj = new vars.constructor(vars.valueOf());
    for (const name in vars) {
      const value = vars[name];
      obj[name] = value;
    }
    return obj;
  } else if (_.isNumber(vars) || _.isBoolean(vars)) {
    return vars.valueOf();
  } else if (_.isDate(vars)) {
    return new Date(vars.getTime());
  } else if (_.isFunction(vars)) {
    return vars;
  } else if (vars instanceof Object) {
    const obj = {};
    for (const name in vars) {
      const value = vars[name];
      obj[name] = clone(value);
    }
    return obj;
  } else {
    return vars;
  }
};

module.exports.clone = clone;

module.exports.isValid = function (value) {
  if (!_.isPlainObject(value)) { return true; }
};

module.exports.expandExamples = function (field) {
  if (!field.type) { return field; }
  if (!(field.examples && field.examples.length)) { return field; }
  field.examples = _.compact(
    field.examples.map((example) => {
      if (field.type === 'string') { return example; }
      let str = _.get(example, 'raw', example);
      if (str && str.trim) { str = str.trim(); }
      if (!str) { return example; }

      const toNormalize = module.exports[field.type]
        ? module.exports[field.type].parse(str)
        : str;

      return normalize(toNormalize);
    })
  );

  return field;
};

/**
 * Returns the hideable type for a field, if it has one.
 * needed because event data from db doesn't have explicit type info
 * may need to add more types in the future.
 *
 * @param {*} field - normalized field from lead data
 * @returns {null|'dob'}
 */
module.exports.getHideableType = function (field) {
  // used this function style in case we need to add more in the future
  if (field.age && field.year) {
    return 'dob';
  }
  return null;
};

/**
 * returns boolean based on call to getHideableType() being null or not
 * @param {*} field - normalized field from lead data
 * @returns {boolean}
 */
module.exports.shouldHide = field => !!this.getHideableType(field);

/**
 * Hides sensitive information that may need to be accessed by admins
 * when reimporting leads.
 *
 * @param {*} field - normalized field from lead data
 * @returns {*}
 */
module.exports.hide = (field) => {
  const type = this.getHideableType(field);
  if (type === 'dob') {
    const hiddenDob = `**/**/${field.year}`;
    field.raw = hiddenDob;
    field.normal = hiddenDob;
  }
  return field;
};
