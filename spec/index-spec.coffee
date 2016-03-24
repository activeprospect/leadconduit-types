assert = require('chai').assert
fs = require('fs')
path = require('path')
index = require('../src')

describe 'Index', ->

  it 'should list type names', ->
    files = fs.readdirSync("#{__dirname}/../src/types")

    expectedTypeNames = files.map (f) ->
      path.basename(f, '.coffee').replace('-', '_')

    expectedTypeNames.splice(expectedTypeNames.indexOf('index'), 1)

    assert.deepEqual index.names, expectedTypeNames


  it 'should not parse a value twice', ->
    parsed = index.parse 'phone', '5127891111'
    assert.equal index.parse('phone', parsed), parsed

  it 'should not parse an invalid value twice', ->
    parsed = index.parse 'phone', 'dog'
    assert.equal index.parse('phone', parsed), parsed

  it 'should clone a value', ->
    obj =
      phone: index.parse 'phone', '5127891111'
      ssn: index.parse 'ssn', '123456789'
    objClone = index.clone(obj)
    assert.deepEqual objClone, obj
