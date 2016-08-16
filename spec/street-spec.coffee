assert = require('chai').assert
types = require('../src')
street = types.street


describe 'Street', ->

  it 'should not parse null', ->
    assert.isNull street.parse(null)

  it 'should parse street number', ->
    assert.equal street.parse('4203 Guadalupe St').number, '4203'

  it 'should parse street name', ->
    assert.equal street.parse('4203 Guadalupe St').name, 'Guadalupe St'

  it 'should retain raw value', ->
    assert.equal street.parse('4203 Guadalupe St').raw, '4203 Guadalupe St'

  it 'should be valid', ->
    assert.isTrue street.parse('4203 Guadalupe St').valid

  it 'should handle invalid value', ->
    parsed = street.parse 'Asdf'
    assert.instanceOf parsed, street
    assert.equal parsed.raw, 'Asdf'
    assert.isUndefined parsed.name
    assert.isUndefined parsed.number
    assert.isFalse parsed.valid

  it 'should strip whitespace', ->
    parsed = street.parse(' 4203 Guadalupe St ')
    assert.equal '4203 Guadalupe St', parsed.toString()
    assert.equal ' 4203 Guadalupe St ', parsed.raw

  it 'should handle parsing a parsed street', ->
    parsed = street.parse(street.parse('4203 Guadalupe St'))
    assert.instanceOf parsed, street
    assert.equal parsed.toString(), '4203 Guadalupe St'
    assert.equal parsed.raw, '4203 Guadalupe St'

  it 'should have examples', ->
    assert street.examples.length

