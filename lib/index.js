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
  const objType = typeof obj;

  if (obj == null || objType === 'function' || obj.masked === true) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((i) => mask(i, doMask));
  }

  if (objType === 'object') {
    const maskBeforeStoring = obj.masked === false;
    const shouldConvertToString = (
      maskBeforeStoring &&
      (obj instanceof String ||
        obj instanceof Boolean ||
        obj instanceof Number ||
        obj instanceof Date));
    const shouldMaskObject = (maskBeforeStoring || doMask);

    const maskedObj = shouldConvertToString
      // use new String() to create a String object,
      // which can have properties assigned to it
      ? new String(mask(obj.toString(), true))
      : obj;
    // use for...in loop to loop through prototype properties
    // obj.masked is assigned to the prototype of maskedObj
    for (const key in obj) {
      if (key === 'valid') {
        maskedObj[key] = obj[key];
      } else {
        const shouldMask = (shouldConvertToString && !digit.test(key)) || shouldMaskObject;
        maskedObj[key] = mask(obj[key], shouldMask);
      }
    }
    if (maskBeforeStoring) {
      maskedObj.masked = true;
    }
    return maskedObj;
  }

  if (!doMask) {
    return obj;
  }

  if (/^(string|number)$/.test(objType)) {
    return obj.toString().replace(/./g, '*');
  }

  if (objType === 'boolean') {
    return '*';
  }

  throw new Error(`Don't know how to mask ${obj}`);
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
 * when reimporting leads. Since we are hiding values after they are stored
 * they will have already been normalized before saving.
 *
 * @param {*} field - normalized field from lead data
 * @returns {*}
 */
module.exports.hide = (field) => {
  const type = this.getHideableType(field);
  if (type === 'dob') {
    const maskedDob = `**/**/${field.year}`;
    // convert to string to protect against front end trying to use Date methods
    const str = new String(maskedDob);
    // needed to reattach age and year properties
    for (const key in field) {
      if (!_.isFunction(field[key])) str[key] = field[key];
    }
    str.raw = maskedDob;
    str.normal = maskedDob;
    str.masked = true;
    field = str;
  }
  return field;
};
