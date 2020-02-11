/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const moment = require('moment');
const types = require('../lib');
const aggregate = require('../lib/aggregate');


describe('Aggregation', function() {

  it('should exclude missing fields', function() {
    const vars = types.normalize({phone_1: types.parse('phone', '(512) 789-1111')});
    return assert.isUndefined(aggregate(vars, {}).phone_1);
  });

  return it('should include fields with no aggregations', function() {
    const vars = types.normalize({donkey: 'kong'});
    return assert.equal(aggregate(vars, {'donkey': 'string'}).donkey, 'kong');
  });
});



describe('Boolean aggregation', function() {

  const fieldTypes = {boolean: 'boolean'};

  it('should be primitive', function() {
    const vars = types.normalize({boolean: types.parse('boolean', 'true')});
    const {
      boolean
    } = aggregate(vars, fieldTypes);
    return assert.equal(boolean, true);
  });


  return it('should be undefined for invalid boolean', function() {
    const vars = types.normalize({boolean: types.parse('boolean', 'donkey')});
    const {
      boolean
    } = aggregate(vars, fieldTypes);
    return assert.isUndefined(boolean);
  });
});



describe('Number aggregation', function() {

  const fieldTypes = {number: 'number'};

  it('should be primitive', function() {
    const vars = types.normalize({number: types.parse('number', '1')});
    const {
      number
    } = aggregate(vars, fieldTypes);
    return assert.equal(number, 1);
  });


  return it('should be undefined for invalid number', function() {
    const vars = types.normalize({lead: { number: types.parse('number', 'donkey') }});
    const {
      number
    } = aggregate(vars, fieldTypes);
    return assert.isUndefined(number);
  });
});



describe('Range aggregation', function() {

  const fieldTypes = {range: 'range'};

  it('should be object', function() {
    const vars = types.normalize({range: types.parse('range', '1 to 10')});
    const {
      range
    } = aggregate(vars, fieldTypes);
    assert.equal(range.min, 1);
    assert.equal(range.max, 10);
    assert.equal(range.avg, 5.5);
    assert.equal(range.mid, 5);
    return assert.equal(range.normal, '1-10');
  });


  return it('should be undefined for invalid range', function() {
    const vars = types.normalize({lead: { range: types.parse('range', 'donkey') }});
    const {
      range
    } = aggregate(vars, fieldTypes);
    return assert.isUndefined(range);
  });
});




describe('Street aggregation', function() {

  const fieldTypes = {address_1: 'street'};

  return it('should be undefined', function() {
    const vars = types.normalize({address_1: types.parse('street', '123 Main Street')});
    const address = aggregate(vars, fieldTypes).address_1;
    return assert.isUndefined(address);
  });
});




describe('State aggregation', function() {

  const fieldTypes = {state: 'state'};

  it('should be string', function() {
    const vars = types.normalize({state: types.parse('state', 'tx')});
    const {
      state
    } = aggregate(vars, fieldTypes);
    return assert.equal(state, 'TX');
  });


  return it('should not be undefined for invalid state', function() {
    const vars = types.normalize({state: types.parse('state', 'donkey')});
    const {
      state
    } = aggregate(vars, fieldTypes);
    return assert.equal(state, 'donkey');
  });
});




describe('Phone aggregation', function() {

  let phone = null;

  beforeEach(function() {
    const vars = types.normalize({phone_1: types.parse('phone', '(512) 789-1111 x123m')});
    const fieldTypes = {phone_1: 'phone'};
    return phone = aggregate(vars, fieldTypes).phone_1;
  });


  it('should include type', () => assert.equal(phone.type, 'mobile'));


  it('should include area code', () => assert.equal(phone.area, '512'));


  it('should include exchange', () => assert.equal(phone.exchange, '789'));


  it('should include country code', () => assert.equal(phone.country_code, 'US'));


  it('should not include line number', () => assert.isUndefined(phone.line));


  return it('should not include extension', () => assert.isUndefined(phone.extension));
});



describe('Email aggregation', function() {


  let email = null;

  beforeEach(function() {
    const vars = types.normalize({email: types.parse('email', 'foo@bar.baz.com')});
    const fieldTypes = {email: 'email'};
    return email = aggregate(vars, fieldTypes).email;
  });


  it('should include domain', () => assert.equal(email.domain, 'bar.baz.com'));


  it('should include host', () => assert.equal(email.host, 'bar.baz'));


  it('should include tld', () => assert.equal(email.tld, 'com'));


  return it('should not include user', () => assert.isUndefined(email.user));
});



describe('Postal code aggregation', function() {

  let postalCode = null;

  beforeEach(function() {
    const vars = types.normalize({postal_code: types.parse('postal_code', '78704-1234')});
    const fieldTypes = {postal_code: 'postal_code'};
    return postalCode = aggregate(vars, fieldTypes).postal_code;
  });


  it('should include zip', () => assert.equal(postalCode.zip, '78704'));


  it('should include country code', () => assert.equal(postalCode.country_code, 'US'));


  return it('should not include four', () => assert.isUndefined(postalCode.four));
});



describe('SSN aggregation', function() {

  let ssn = null;

  beforeEach(function() {
    const vars = types.normalize({ssn: types.parse('ssn', '123-45-6789')});
    const fieldTypes = {ssn: 'ssn'};
    return ssn = aggregate(vars, fieldTypes).ssn;
  });


  return it('should not be aggregated', () => assert.isUndefined(ssn));
});



describe('Time aggregation', function() {

  let time = null;
  let expected = null;

  beforeEach(function() {
    expected = new Date().toISOString();
    const vars = types.normalize({timestamp: types.parse('time', expected)});
    const fieldTypes = {timestamp: 'time'};
    return time = aggregate(vars, fieldTypes).timestamp;
  });


  return it('should aggregate as normal value', () => assert.equal(time, expected));
});



describe('Date aggregation', function() {

  let date = null;
  let expected = null;

  beforeEach(function() {
    expected = moment().format('YYYY-MM-DD');
    const vars = types.normalize({dob: types.parse('date', expected)});
    const fieldTypes = {dob: 'date'};
    return date = aggregate(vars, fieldTypes).dob;
  });


  return it('should aggregate as normal value', () => assert.equal(date, expected));
});
