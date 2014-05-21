assert = require('chai').assert
normalize = require('../src/index').normalize

describe 'Normalize utility', ->

  it 'should not normalize primitives', ->
    normalized = normalize
      string: 'a string'
      number: 8
      boolean: true

    assert.deepEqual normalized,
      string: 'a string'
      number: 8
      boolean: true

  it 'should normalize String to string', ->
    assert.deepEqual normalize(string: new String('a string')), string: 'a string'

  it 'should normalize Number to number', ->
    assert.deepEqual normalize(number: new Number(8)), number: 8

  it 'should normalize Boolean to boolean', ->
    assert.deepEqual normalize(boolean: new Boolean(true)), boolean: true

  it 'should normalize extended String to object', ->
    ext = new String('a string')
    ext.foo = 'bar'
    assert.deepEqual normalize(string: ext), string: { normal: 'a string', foo: 'bar' }

  it 'should normalize extended Number to object', ->
    ext = new Number(8)
    ext.foo = 'bar'
    assert.deepEqual normalize(number: ext), number: { normal: 8, foo: 'bar' }

  it 'should normalize extended Boolean to object', ->
    ext = new Boolean(true)
    ext.foo = 'bar'
    assert.deepEqual normalize(boolean: ext), boolean: { normal: true, foo: 'bar' }

  it 'should normalize deeply', ->
    ext = new String('bar')
    ext.baz = new String('bip')
    ext.baz.bip = 'bap'

    normalized = normalize
      string: 'a string'
      object:
        foo: new String('bar')
        String: ext

    assert.deepEqual normalized,
      string: 'a string'
      object:
        foo: 'bar'
        String:
          normal: 'bar'
          baz:
            normal: 'bip'
            bip: 'bap'


  it 'should normalize array', ->
    arr = [ new String('a string'), new Number(8), new Boolean(true) ]

    assert.deepEqual normalize(arr),
      [ 'a string', 8, true ]
