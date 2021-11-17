const _ = require('lodash');
const { assert } = require('chai');
const { mask, parse } = require('../lib');

describe('Mask utility', function () {
  const obj = {
    data_service: {
      ip: '45.33.110.8',
      wpm: {
        normal: 789.2497805388616,
        valid: 'true',
        raw: 789.2497805388616
      },
      city: 'Fremont',
      state: 'CA',
      framed: {
        normal: 'false',
        valid: 'true',
        raw: 'false'
      },
      device: '',
      browser: 'Chrome 65.0.3325.181',
      time_zone: 'America/Los_Angeles',
      created_at: {
        normal: '2021-10-27T16:29:59Z',
        raw: '2021-10-27T16:29:59Z',
        valid: 'true'
      },
      postal_code: 94536,
      country_code: 'US',
      has_consented: {
        normal: true,
        valid: true,
        raw: true
      }
    }
  };

  const maskedObj = {
    data_service: {
      ip: '***********',
      wpm: {
        normal: '*****************',
        valid: 'true',
        raw: '*****************'
      },
      city: '*******',
      state: '**',
      framed: {
        normal: 'false',
        valid: 'true',
        raw: 'false'
      },
      device: '',
      browser: 'Chrome 65.0.3325.181',
      time_zone: 'America/Los_Angeles',
      created_at: {
        normal: '2021-10-27T16:29:59Z',
        raw: '2021-10-27T16:29:59Z',
        valid: 'true'
      },
      postal_code: 94536,
      country_code: 'US',
      has_consented: {
        normal: true,
        valid: true,
        raw: true
      }
    }
  };

  it('should mask primitives', function () {
    const masked = mask({
      string: 'a string',
      number: 102,
      boolean: true,
      masked: false
    });

    assert.equal(masked.string, '********');
    assert.equal(masked.number, '***');
    assert.equal(masked.boolean, '*');
  });

  it('should not mask null', function () {
    const masked = mask({ masked: false, null: null });
    assert.isTrue(masked.masked);
    assert.isNull(masked.null);
  });

  it('should not mask masked flag', function () {
    const masked = mask({ masked: false });
    assert.isTrue(masked.masked);
  });

  it('should not mask valid flag', function () {
    const masked = mask({ masked: false, valid: true });
    assert.isTrue(masked.valid);
  });

  it('should mask deeply', function () {
    const masked = mask({
      masked: false,
      string: 'a string',
      object: {
        foo: 'bar',
        baz: {
          bip: 'bap'
        }
      }
    });

    assert.deepEqual(masked, {
      masked: true,
      string: '********',
      object: {
        foo: '***',
        baz: {
          bip: '***'
        }
      }
    });
  });

  it('should mask array', function () {
    const masked = mask({
      masked: false,
      array: [1, '23', true]
    });

    assert.deepEqual(masked, {
      masked: true,
      array: ['*', '**', '*']
    });
  });

  it('should mask array of objects', function () {
    const masked = mask({
      masked: false,
      array: [
        { string: 'a string', number: 103, boolean: false },
        { string: 'another string', number: 1000, boolean: true }
      ]
    });

    assert.deepEqual(masked, {
      masked: true,
      array: [
        { string: '********', number: '***', boolean: '*' },
        { string: '**************', number: '****', boolean: '*' }
      ]
    });
  });

  it('should mask array of objects with valid flags', function () {
    const masked = mask({
      masked: false,
      array: [
        { string: 'a string', number: 103, boolean: false, valid: true },
        { string: 'another string', number: 1000, boolean: true, valid: false }
      ]
    });

    assert.deepEqual(masked, {
      masked: true,
      array: [
        { string: '********', number: '***', boolean: '*', valid: true },
        { string: '**************', number: '****', boolean: '*', valid: false }
      ]
    });
  });

  // this is the same form as 'rich types' (phone, ssn, email, etc.)
  it('should mask String object with properties', function () {
    const str = new String('foobar');
    str.foo = 'bar';
    str.bar = 'bazz';
    str.masked = false;
    str.valid = true;
    const masked = mask(str);
    assert.equal(masked.foo, '***');
    assert.equal(masked.bar, '****');
    assert.equal(masked.toString(), '******');
    assert.isTrue(masked.masked);
    assert.isTrue(masked.valid);
  });

  it('should not mask twice', function () {
    const str = new String('foo***');
    str.masked = true;
    const masked = mask(str);
    assert.equal(masked.toString(), 'foo***');
    assert.isTrue(masked.masked);
  });

  it('should handle function', function () {
    const str = new String('foo');
    str.masked = false;
    str.foo = function () {};
    const masked = mask(str);
    assert.equal(masked.toString(), '***');
    assert.isTrue(masked.masked);
  });

  // Current behavior: does not mask
  it('should mask when the masked property is undefined', function () {
    const o = _.cloneDeep(obj);
    const masked = mask(o);
    assert.equal(masked.data_service.ip, obj.data_service.ip);
  });

  // Current behavior: does not mask
  it('should mask when the masked property is null', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = null;
    const masked = mask(o);
    assert.equal(masked.data_service.ip, obj.data_service.ip);
  });

  // Current behavior: masks
  it('should not mask when the masked property is true', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = true;
    const masked = mask(o);
    assert.equal(masked.data_service.ip, maskedObj.data_service.ip);
  });

  // Current behavior: masks
  it('should mask when the masked property is false', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = false;
    const masked = mask(o);
    assert.equal(masked.data_service.ip, maskedObj.data_service.ip);
  });

  // Current behavior: masks
  it('should mask when the masked property is a string', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = 'true';
    const masked = mask(o);
    assert.equal(masked.data_service.ip, maskedObj.data_service.ip);
  });

  // Current behavior: masks
  it('should mask when the masked property is a number', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = 123;
    const masked = mask(o);
    assert.equal(masked.data_service.ip, maskedObj.data_service.ip);
  });

  // Current behavior: masks
  it('should mask when the masked property is an array', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = [];
    const masked = mask(o);
    assert.equal(masked.data_service.ip, maskedObj.data_service.ip);
  });

  // Current behavior: masks
  it('should mask when the masked property is an object', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = {};
    const masked = mask(o);
    assert.equal(masked.data_service.ip, maskedObj.data_service.ip);
  });

  // Current behavior: masks
  it('should mask when the masked property is a numeric rich type', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = parse('number', 123);
    const masked = mask(o);
    assert.equal(masked.data_service.ip, maskedObj.data_service.ip);
  });

  // Current behavior: masks
  it('should mask when the masked property is a boolean rich type whose value is true', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = parse('boolean', true);
    const masked = mask(o);
    assert.equal(masked.data_service.ip, maskedObj.data_service.ip);
  });

  // Current behavior: masks
  it('should mask when the masked property is a boolean rich type object whose value is true', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = { normal: true, valid: true, raw: true };
    const masked = mask(o);
    assert.equal(masked.data_service.ip, maskedObj.data_service.ip);
  });

  // Current behavior: masks
  it('should mask when the masked property is a boolean rich type object whose value is "true"', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = { normal: 'true', valid: 'true', raw: 'true' };
    const masked = mask(o);
    assert.equal(masked.data_service.ip, maskedObj.data_service.ip);
  });

  // Current behavior: masks
  it('should mask when the masked property is a boolean rich type whose value is true', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = parse('boolean', false);
    const masked = mask(o);
    assert.equal(masked.data_service.ip, maskedObj.data_service.ip);
  });

  // Current behavior: masks
  // New behavior: does not mask
  it('should not mask when the masked property is a boolean rich type object whose value is false', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = { normal: false, valid: true, raw: false };
    const masked = mask(o);
    console.dir(masked,{depth:null});
    assert.equal(masked.data_service.ip, obj.data_service.ip);
  });

  // Current behavior: masks
  // New behavior: does not mask
  it('should not mask when the masked property is a boolean rich type object whose value is "false"', function () {
    const o = _.cloneDeep(obj);
    o.data_service.masked = { normal: 'false', valid: 'true', raw: 'false' };
    const masked = mask(o);
    console.dir(masked,{depth:null});
    assert.equal(masked.data_service.ip, obj.data_service.ip);
  });
});
