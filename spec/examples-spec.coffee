_ = require('lodash')
assert = require('chai').assert
index = require('../src/index')


describe 'Examples', ->

  for typeName in index.names
    do (typeName) ->

      type = index[typeName]
      if type.examples?.length
        it "should be valid for #{typeName}", ->
          for example in type.examples
            assert example.valid, "#{typeName} has an invalid example: #{JSON.stringify(example)}" if _.isPlainObject(example)
