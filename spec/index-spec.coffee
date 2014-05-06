assert = require('chai').assert
fs = require('fs')
path = require('path')
index = require('../src/index')

describe 'Index', ->

  it 'should list all types', ->
    files = fs.readdirSync("#{__dirname}/../src/")

    expectedTypeNames = files.map (f) ->
      path.basename(f, '.coffee')
    expectedTypeNames.splice(expectedTypeNames.indexOf('index'), 1)

    assert.deepEqual Object.keys(index), expectedTypeNames
