const { assert } = require('chai');
const moment = require('moment');
const types = require('../lib');
const aggregate = require('../lib/aggregate');

describe('Aggregation', function () {
  it('should exclude missing fields', function () {
    const vars = types.normalize({ phone_1: types.parse('phone', '(512) 789-1111') });
    assert.isUndefined(aggregate(vars, {}).phone_1);
  });

  it('should include fields with no aggregations', function () {
    const vars = types.normalize({ donkey: 'kong' });
    assert.equal(aggregate(vars, { donkey: 'string' }).donkey, 'kong');
  });
});

describe('Wildcard Object aggregation', function () {
  it('Should include custom wildcard type with object data', function () {
    const fieldTypes = { 'custom.*': 'wildcard' };
    const vars = types.normalize({ custom: { donkey: 'kong', mario: 'bros' } });
    const { custom } = aggregate(vars, fieldTypes);
    assert.deepEqual(custom, { donkey: 'kong', mario: 'bros' });
  });
  it('Should include vars.lead.custom wildcard type with object data', function () {
    const fieldTypes = { 'vars.lead.custom.*': 'wildcard' };
    const vars = types.normalize({ vars: { lead: { custom: { donkey: 'kong', mario: 'bros' } } } });
    const { vars: { lead: { custom } } } = aggregate(vars, fieldTypes);
    assert.deepEqual(custom, { donkey: 'kong', mario: 'bros' });
  });
});

describe('Boolean aggregation', function () {
  const fieldTypes = { boolean: 'boolean' };

  it('should be primitive', function () {
    const vars = types.normalize({ boolean: types.parse('boolean', 'true') });
    const { boolean } = aggregate(vars, fieldTypes);
    assert.equal(boolean, true);
  });

  it('should be undefined for invalid boolean', function () {
    const vars = types.normalize({ boolean: types.parse('boolean', 'donkey') });
    const { boolean } = aggregate(vars, fieldTypes);
    assert.isUndefined(boolean);
  });
});

describe('Number aggregation', function () {
  const fieldTypes = { number: 'number' };

  it('should be primitive', function () {
    const vars = types.normalize({ number: types.parse('number', '1') });
    const { number } = aggregate(vars, fieldTypes);
    assert.equal(number, 1);
  });

  it('should be undefined for invalid number', function () {
    const vars = types.normalize({ lead: { number: types.parse('number', 'donkey') } });
    const { number } = aggregate(vars, fieldTypes);
    assert.isUndefined(number);
  });
});

describe('Range aggregation', function () {
  const fieldTypes = { range: 'range' };

  it('should be object', function () {
    const vars = types.normalize({ range: types.parse('range', '1 to 10') });
    const { range } = aggregate(vars, fieldTypes);
    assert.equal(range.min, 1);
    assert.equal(range.max, 10);
    assert.equal(range.avg, 5.5);
    assert.equal(range.mid, 5);
    assert.equal(range.normal, '1-10');
  });

  it('should be undefined for invalid range', function () {
    const vars = types.normalize({ lead: { range: types.parse('range', 'donkey') } });
    const { range } = aggregate(vars, fieldTypes);
    assert.isUndefined(range);
  });
});

describe('Street aggregation', function () {
  const fieldTypes = { address_1: 'street' };

  it('should be undefined', function () {
    const vars = types.normalize({ address_1: types.parse('street', '123 Main Street') });
    const address = aggregate(vars, fieldTypes).address_1;
    assert.isUndefined(address);
  });
});

describe('State aggregation', function () {
  const fieldTypes = { state: 'state' };

  it('should be string', function () {
    const vars = types.normalize({ state: types.parse('state', 'tx') });
    const { state } = aggregate(vars, fieldTypes);
    assert.equal(state, 'TX');
  });

  it('should not be undefined for invalid state', function () {
    const vars = types.normalize({ state: types.parse('state', 'donkey') });
    const { state } = aggregate(vars, fieldTypes);
    assert.equal(state, 'donkey');
  });
});

describe('Phone aggregation', function () {
  let phone = null;

  beforeEach(() => {
    const vars = types.normalize({ phone_1: types.parse('phone', '(512) 789-1111 x123m') });
    const fieldTypes = { phone_1: 'phone' };
    phone = aggregate(vars, fieldTypes).phone_1;
  });

  it('should include type', function () {
    assert.equal(phone.type, 'mobile');
  });

  it('should include area code', function () {
    assert.equal(phone.area, '512');
  });

  it('should include exchange', function () {
    assert.equal(phone.exchange, '789');
  });

  it('should include country code', function () {
    assert.equal(phone.country_code, 'US');
  });

  it('should not include line number', function () {
    assert.isUndefined(phone.line);
  });

  it('should not include extension', function () {
    assert.isUndefined(phone.extension);
  });
});

describe('Email aggregation', function () {
  let email = null;

  beforeEach(() => {
    const vars = types.normalize({ email: types.parse('email', 'foo@bar.baz.com') });
    const fieldTypes = { email: 'email' };
    email = aggregate(vars, fieldTypes).email;
  });

  it('should include domain', function () {
    assert.equal(email.domain, 'bar.baz.com');
  });

  it('should include host', function () {
    assert.equal(email.host, 'bar.baz');
  });

  it('should include tld', function () {
    assert.equal(email.tld, 'com');
  });

  it('should not include user', function () {
    assert.isUndefined(email.user);
  });
});

describe('Postal code aggregation', function () {
  let postalCode = null;

  beforeEach(() => {
    const vars = types.normalize({ postal_code: types.parse('postal_code', '78704-1234') });
    const fieldTypes = { postal_code: 'postal_code' };
    postalCode = aggregate(vars, fieldTypes).postal_code;
  });

  it('should include zip', function () {
    assert.equal(postalCode.zip, '78704');
  });

  it('should include country code', function () {
    assert.equal(postalCode.country_code, 'US');
  });

  it('should not include four', function () {
    assert.isUndefined(postalCode.four);
  });
});

describe('SSN aggregation', function () {
  let ssn = null;

  beforeEach(() => {
    const vars = types.normalize({ ssn: types.parse('ssn', '123-45-6789') });
    const fieldTypes = { ssn: 'ssn' };
    ssn = aggregate(vars, fieldTypes).ssn;
  });

  it('should not be aggregated', function () {
    assert.isUndefined(ssn);
  });
});

describe('Time aggregation', function () {
  let time = null;
  let expected = null;

  beforeEach(() => {
    expected = new Date().toISOString();
    const vars = types.normalize({ timestamp: types.parse('time', expected) });
    const fieldTypes = { timestamp: 'time' };
    time = aggregate(vars, fieldTypes).timestamp;
  });

  it('should aggregate as normal value', function () {
    assert.equal(time, expected);
  });
});

describe('Date aggregation', function () {
  let date = null;
  let expected = null;

  beforeEach(() => {
    expected = moment().format('YYYY-MM-DD');
    const vars = types.normalize({ dob: types.parse('date', expected) });
    const fieldTypes = { dob: 'date' };
    date = aggregate(vars, fieldTypes).dob;
  });

  it('should aggregate as normal value', function () {
    assert.equal(date, expected);
  });
});
