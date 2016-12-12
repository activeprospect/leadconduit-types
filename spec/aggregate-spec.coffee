assert = require('chai').assert
moment = require('moment')
types = require('../src')
aggregate = require('../src/aggregate')


describe 'Aggregation', ->

  it 'should exclude missing fields', ->
    vars = types.normalize(phone_1: types.parse('phone', '(512) 789-1111'))
    assert.isUndefined aggregate(vars, {}).phone_1

  it 'should include fields with no aggregations', ->
    vars = types.normalize(donkey: 'kong')
    assert.equal aggregate(vars, 'donkey': 'string').donkey, 'kong'



describe 'Boolean aggregation', ->

  fieldTypes = boolean: 'boolean'

  it 'should be primitive', ->
    vars = types.normalize(boolean: types.parse('boolean', 'true'))
    boolean = aggregate(vars, fieldTypes).boolean
    assert.equal boolean, true


  it 'should be undefined for invalid boolean', ->
    vars = types.normalize(boolean: types.parse('boolean', 'donkey'))
    boolean = aggregate(vars, fieldTypes).boolean
    assert.isUndefined boolean



describe 'Number aggregation', ->

  fieldTypes = number: 'number'

  it 'should be primitive', ->
    vars = types.normalize(number: types.parse('number', '1'))
    number = aggregate(vars, fieldTypes).number
    assert.equal number, 1


  it 'should be undefined for invalid number', ->
    vars = types.normalize(lead: { number: types.parse('number', 'donkey') })
    number = aggregate(vars, fieldTypes).number
    assert.isUndefined number



describe 'Range aggregation', ->

  fieldTypes = range: 'range'

  it 'should be object', ->
    vars = types.normalize(range: types.parse('range', '1 to 10'))
    range = aggregate(vars, fieldTypes).range
    assert.equal range.min, 1
    assert.equal range.max, 10
    assert.equal range.avg, 5.5
    assert.equal range.mid, 5
    assert.equal range.normal, '1-10'


  it 'should be undefined for invalid range', ->
    vars = types.normalize(lead: { range: types.parse('range', 'donkey') })
    range = aggregate(vars, fieldTypes).range
    assert.isUndefined range




describe 'Street aggregation', ->

  fieldTypes = address_1: 'street'

  it 'should be undefined', ->
    vars = types.normalize(address_1: types.parse('street', '123 Main Street'))
    address = aggregate(vars, fieldTypes).address_1
    assert.isUndefined address




describe 'State aggregation', ->

  fieldTypes = state: 'state'

  it 'should be string', ->
    vars = types.normalize(state: types.parse('state', 'tx'))
    state = aggregate(vars, fieldTypes).state
    assert.equal state, 'TX'


  it 'should not be undefined for invalid state', ->
    vars = types.normalize(state: types.parse('state', 'donkey'))
    state = aggregate(vars, fieldTypes).state
    assert.equal state, 'donkey'




describe 'Phone aggregation', ->

  phone = null

  beforeEach ->
    vars = types.normalize(phone_1: types.parse('phone', '(512) 789-1111 x123m'))
    fieldTypes = phone_1: 'phone'
    phone = aggregate(vars, fieldTypes).phone_1


  it 'should include type', ->
    assert.equal phone.type, 'mobile'


  it 'should include area code', ->
    assert.equal phone.area, '512'


  it 'should include exchange', ->
    assert.equal phone.exchange, '789'


  it 'should include country code', ->
    assert.equal phone.country_code, 'US'


  it 'should not include line number', ->
    assert.isUndefined phone.line


  it 'should not include extension', ->
    assert.isUndefined phone.extension



describe 'Email aggregation', ->


  email = null

  beforeEach ->
    vars = types.normalize(email: types.parse('email', 'foo@bar.baz.com'))
    fieldTypes = email: 'email'
    email = aggregate(vars, fieldTypes).email


  it 'should include domain', ->
    assert.equal email.domain, 'bar.baz.com'


  it 'should include host', ->
    assert.equal email.host, 'bar.baz'


  it 'should include tld', ->
    assert.equal email.tld, 'com'


  it 'should not include user', ->
    assert.isUndefined email.user



describe 'Postal code aggregation', ->

  postalCode = null

  beforeEach ->
    vars = types.normalize(postal_code: types.parse('postal_code', '78704-1234'))
    fieldTypes = postal_code: 'postal_code'
    postalCode = aggregate(vars, fieldTypes).postal_code


  it 'should include zip', ->
    assert.equal postalCode.zip, '78704'


  it 'should include country code', ->
    assert.equal postalCode.country_code, 'US'


  it 'should not include four', ->
    assert.isUndefined postalCode.four



describe 'SSN aggregation', ->

  ssn = null

  beforeEach ->
    vars = types.normalize(ssn: types.parse('ssn', '123-45-6789'))
    fieldTypes = ssn: 'ssn'
    ssn = aggregate(vars, fieldTypes).ssn


  it 'should not be aggregated', ->
    assert.isUndefined ssn



describe 'Time aggregation', ->

  time = null
  expected = null

  beforeEach ->
    expected = new Date().toISOString()
    vars = types.normalize(timestamp: types.parse('time', expected))
    fieldTypes = timestamp: 'time'
    time = aggregate(vars, fieldTypes).timestamp


  it 'should aggregate as normal value', ->
    assert.equal time, expected



describe 'Date aggregation', ->

  date = null
  expected = null

  beforeEach ->
    expected = moment().format('YYYY-MM-DD')
    vars = types.normalize(dob: types.parse('date', expected))
    fieldTypes = dob: 'date'
    date = aggregate(vars, fieldTypes).dob


  it 'should aggregate as normal value', ->
    assert.equal date, expected
