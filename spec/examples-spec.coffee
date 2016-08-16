_ = require('lodash')
assert = require('chai').assert
types = require('../src')


describe 'Examples', ->

  for typeName in types.names
    do (typeName) ->

      type = types[typeName]
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
      types.expandExamples(@field)
      assert.deepEqual @field.examples, [ types.phone.parse('512-788-1111') ]


    it 'should re-expand expanded examples', ->
      types.expandExamples(@field)
      @field.examples[0].prefix = '2'
      types.expandExamples(@field)
      assert.deepEqual @field.examples, [ types.phone.parse('512-788-1111') ]
