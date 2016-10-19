_ = require('lodash')
assert = require('chai').assert
index = require('../src')


describe 'Examples', ->

  for typeName in Object.keys(index)
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
      assert.deepEqual @field.examples, [
        normal: '5127881111'
        prefix: '1'
        raw: '512-788-1111'
        area: '512'
        exchange: '788'
        line: '1111'
        number: '7881111'
        extension: null
        is_tollfree: false
        country_code: 'US'
        type: null
        valid: true
      ]

    it 'should re-expand expanded examples', ->
      index.expandExamples(@field)
      @field.examples[0].prefix = '2'

      index.expandExamples(@field)
      assert.deepEqual @field.examples, [
        normal: '5127881111'
        prefix: '1'
        raw: '512-788-1111'
        area: '512'
        exchange: '788'
        line: '1111'
        number: '7881111'
        extension: null
        is_tollfree: false
        country_code: 'US'
        type: null
        valid: true
      ]
