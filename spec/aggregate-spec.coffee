assert = require('chai').assert
types = require('../src')
aggregate = require('../src/aggregate')


describe 'Aggregation', ->

  it 'should exclude missing fields', ->
    vars = phone_1: types.parse('phone', '(512) 789-1111')
    assert.isUndefined aggregate(vars, {}).phone_1

  it 'should include fields with no aggregations', ->
    vars = donkey: 'kong'
    assert.equal aggregate(vars, 'donkey': 'string').donkey, 'kong'



describe 'Boolean aggregation', ->

  fieldTypes = boolean: 'boolean'

  it 'should be primitive', ->
    vars = boolean: types.parse('boolean', 'true')
    boolean = aggregate(vars, fieldTypes).boolean
    assert.equal boolean, true


  it 'should be undefined for invalid boolean', ->
    vars = boolean: types.parse('boolean', 'donkey')
    boolean = aggregate(vars, fieldTypes).boolean
    assert.isUndefined boolean



describe 'Number aggregation', ->

  fieldTypes = number: 'number'

  it 'should be primitive', ->
    vars = number: types.parse('number', '1')
    number = aggregate(vars, fieldTypes).number
    assert.equal number, 1


  it 'should be undefined for invalid number', ->
    vars = lead: { number: types.parse('number', 'donkey') }
    number = aggregate(vars, fieldTypes).number
    assert.isUndefined number



describe 'Range aggregation', ->

  fieldTypes = range: 'range'

  it 'should be object', ->
    vars = range: types.parse('range', '1 to 10')
    range = aggregate(vars, fieldTypes).range
    assert.equal range.min, 1
    assert.equal range.max, 10
    assert.equal range.avg, 5.5
    assert.equal range.mid, 5
    assert.equal range.normal, '1-10'


  it 'should be undefined for invalid range', ->
    vars = lead: { range: types.parse('range', 'donkey') }
    range = aggregate(vars, fieldTypes).range
    assert.isUndefined range




describe 'State aggregation', ->

  fieldTypes = state: 'state'

  it 'should be string', ->
    vars = state: types.parse('state', 'tx')
    state = aggregate(vars, fieldTypes).state
    assert.equal state, 'TX'


  it 'should be undefined for invalid range', ->
    vars = range: types.parse('state', 'donkey')
    state = aggregate(vars, fieldTypes).state
    assert.isUndefined state




describe 'Phone aggregation', ->

  phone = null

  beforeEach ->
    vars = phone_1: types.parse('phone', '(512) 789-1111 x123m')
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
    vars = email: types.parse('email', 'foo@bar.baz.com')
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
    vars = postal_code: types.parse('postal_code', '78704-1234')
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
    vars = ssn: types.parse('ssn', '123-45-6789')
    fieldTypes = ssn: 'ssn'
    ssn = aggregate(vars, fieldTypes).ssn


  it 'should not be aggregated', ->
    assert.isUndefined ssn
