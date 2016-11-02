assert = require('chai').assert
types = require('../src')
aggregate = require('../src/aggregate')


describe 'Aggregation', ->

  it 'should exclude missing fields', ->
    vars = lead: { phone_1: types.parse('phone', '(512) 789-1111') }
    assert.isUndefined aggregate(vars, {}).phone_1

  it 'should include fields with no aggregations', ->
    vars = lead: { donkey: 'kong' }
    assert.equal aggregate(vars, donkey: 'string').lead.donkey, 'kong'




describe 'Phone aggregation', ->

  phone = null

  beforeEach ->
    vars = lead: { phone_1: types.parse('phone', '(512) 789-1111 x123m') }
    fieldTypes = phone_1: 'phone'
    phone = aggregate(vars, fieldTypes).lead.phone_1


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
    vars = lead: { email: types.parse('email', 'foo@bar.baz.com') }
    fieldTypes = email: 'email'
    email = aggregate(vars, fieldTypes).lead.email


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
    vars = lead: { postal_code: types.parse('postal_code', '78704-1234') }
    fieldTypes = postal_code: 'postal_code'
    postalCode = aggregate(vars, fieldTypes).lead.postal_code


  it 'should include zip', ->
    assert.equal postalCode.zip, '78704'


  it 'should include country code', ->
    assert.equal postalCode.country_code, 'US'


  it 'should not include four', ->
    assert.isUndefined postalCode.four



describe 'SSN aggregation', ->

  ssn = null

  beforeEach ->
    vars = lead: { ssn: types.parse('ssn', '123-45-6789') }
    fieldTypes = ssn: 'ssn'
    console.log aggregate(vars, fieldTypes)
    ssn = aggregate(vars, fieldTypes).lead.ssn


  it 'should not be aggregated', ->
    assert.isUndefined ssn
