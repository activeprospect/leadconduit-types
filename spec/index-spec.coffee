assert = require('chai').assert
fs = require('fs')
path = require('path')
types = require('../src')

describe 'Index', ->

  it 'should list type names', ->
    files = fs.readdirSync("#{__dirname}/../src/types")

    expectedTypeNames = files.map (f) ->
      path.basename(f, '.coffee').replace('-', '_')

    expectedTypeNames.splice(expectedTypeNames.indexOf('index'), 1)

    assert.deepEqual types.names, expectedTypeNames


  it 'should not parse a value twice', ->
    parsed = types.parse 'phone', '5127891111'
    assert.equal types.parse('phone', parsed), parsed

  it 'should not parse an invalid value twice', ->
    parsed = types.parse 'phone', 'dog'
    assert.equal types.parse('phone', parsed), parsed

  it 'should clone a value', ->
    obj =
      phone: types.parse 'phone', '5127891111'
      ssn: types.parse 'ssn', '123456789'
    objClone = types.clone(obj)
    assert.deepEqual objClone, obj
