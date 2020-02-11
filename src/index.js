/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let mask, name, type, typeNames;
const _ = require('lodash');
const normalize = require('./normalize');
const aggregate = require('./aggregate');
const types = require('./types');
const digit = /^\d+$/;

module.exports.names = (typeNames = Object.keys(types));

for (name in types) {
  type = types[name];
  module.exports[name] = type;
}

module.exports.normalize = normalize;
module.exports.aggregate = aggregate;

module.exports.parse = function(name, value, req) {
  // Look up the type of the field, based on its name
  let fieldType;
  if (typeNames.indexOf(name) !== -1) { fieldType = module.exports[name]; }

  if ((fieldType != null) && (value != null)) {
    if ((fieldType.components != null ? fieldType.components.length : undefined) && (value.valid != null)) {
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


module.exports.mask = (mask = function(obj, doMask) {
  if (doMask == null) { doMask = false; }
  if (obj == null) { return obj; }
  if (obj instanceof Array) {
    obj = obj.map(i => mask(i, doMask));
  } else if (typeof obj === 'object') {
    let key, value;
    if ((obj.masked === false) && (obj instanceof String || obj instanceof Boolean || obj instanceof Number || obj instanceof Date)) {
      const str = new String(mask(obj.toString(), true));
      for (key in obj) {
        value = obj[key];
        if (key === 'valid') {
          str[key] = value;
        } else {
          if (!key.match(digit)) { str[key] = mask(value, true); }
        }
      }
      str.masked = true;
      obj = str;
    } else {
      for (key in obj) {
        value = obj[key];
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
    undefined;
  } else {
    throw `Don't know how to mask ${obj}`;
  }
  return obj;
});

var clone = function(vars) {
  let obj, value;
  if (_.isArray(vars)) {
    return vars.map(v => clone(v));
  } else if (vars instanceof String) {
    const str = new String(vars.toString());
    for (name in vars) {
      value = vars[name];
      if (!name.match(digit)) { str[name] = value; }
    }
    return str;
  } else if (vars instanceof Number || vars instanceof Boolean || vars instanceof Date) {
    obj = new vars.constructor(vars.valueOf());
    for (name in vars) {
      value = vars[name];
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
    obj = {};
    for (name in vars) {
      value = vars[name];
      obj[name] = clone(value);
    }
    return obj;
  } else {
    return vars;
  }
};

module.exports.clone = clone;

module.exports.isValid = function(value) {
  if (!_.isPlainObject(value)) { return true; }
};

module.exports.expandExamples = function(field) {
  if (!field.type) { return field; }
  if (!(field.examples != null ? field.examples.length : undefined)) { return field; }
  field.examples = _.compact(field.examples.map(function(example) {
    if (field.type === 'string') { return example; }
    let str = ((example != null ? example.raw : undefined) || example);
    if ((str != null ? str.trim : undefined) != null) { str = str != null ? str.trim() : undefined; }
    if (!str) { return example; }
    return normalize((module.exports[field.type] != null ? module.exports[field.type].parse(str) : undefined) || str);
  })
  );
  return field;
};

