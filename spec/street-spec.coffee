assert = require('chai').assert
street = require('../src/street')


describe 'Street', ->

  it 'should return a String object', ->
    assert.instanceOf street.parse('4203 Guadalupe St'), String

  it 'should parse street number', ->
    assert.equal street.parse('4203 Guadalupe St').street_number, '4203'

  it 'should parse street name', ->
    assert.equal street.parse('4203 Guadalupe St').street_name, 'Guadalupe St'

  it 'should retain raw value', ->
    assert.equal street.parse('4203 Guadalupe St').raw, '4203 Guadalupe St'

  it 'should be valid', ->
    assert.isTrue street.parse('4203 Guadalupe St').valid

  it 'should handle invalid value', ->
    parsed = street.parse 'Asdf'
    assert.instanceOf parsed, String
    assert.equal parsed.raw, 'Asdf'
    assert.isUndefined parsed.street_name
    assert.isUndefined parsed.street_number
    assert.isFalse parsed.valid

  it 'should strip whitespace', ->
    parsed = street.parse(' 4203 Guadalupe St ')
    assert.equal '4203 Guadalupe St', parsed.toString()
    assert.equal ' 4203 Guadalupe St ', parsed.raw

  it 'should handle parsing a parsed street', ->
    parsed = street.parse(street.parse('4203 Guadalupe St'))
    assert.instanceOf parsed, String
    assert.equal parsed.toString(), '4203 Guadalupe St'
    assert.equal parsed.raw, '4203 Guadalupe St'

  it 'should have examples', ->
    assert street.examples.length
