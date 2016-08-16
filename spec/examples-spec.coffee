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

  describe 'expand', ->

    beforeEach ->
      @field =
        id: 'tellie'
        type: 'phone'
        examples: ['512-788-1111']


    it 'should expand based on type', ->
      index.expandExamples(@field)
      assert.deepEqual @field.examples, [ index.phone.parse('512-788-1111') ]


    it 'should re-expand expanded examples', ->
      index.expandExamples(@field)
      @field.examples[0].prefix = '2'
      index.expandExamples(@field)
      assert.deepEqual @field.examples, [ index.phone.parse('512-788-1111') ]
