assert = require('chai').assert
mask = require('../src').mask

describe 'Mask utility', ->

  it 'should mask primitives', ->
    masked = mask
      string: 'a string'
      number: 102
      boolean: true
      masked: false

    assert.equal masked.string, '********'
    assert.equal masked.number, '***'
    assert.equal masked.boolean, '*'


  it 'should not mask null', ->
    masked = mask(masked: false, null: null)
    assert.isTrue masked.masked
    assert.isNull masked.null

  it 'should not mask masked flag', ->
    masked = mask(masked: false)
    assert.isTrue masked.masked


  it 'should not mask valid flag', ->
    masked = mask(masked: false, valid: true)
    assert.isTrue masked.valid


  it 'should mask deeply', ->
    masked = mask
      masked: false
      string: 'a string'
      object:
        foo: 'bar'
        baz:
          bip: 'bap'

    assert.deepEqual masked,
      masked: true
      string: '********'
      object:
        foo: '***'
        baz:
          bip: '***'


  it 'should mask array', ->
    masked = mask
      masked: false,
      array: [1, '23', true]

    assert.deepEqual masked,
      masked: true
      array: [ '*', '**', '*' ]


  it 'should mask array of objects', ->
    masked = mask
      masked: false,
      array: [
        { string: 'a string', number: 103, boolean: false }
        { string: 'another string', number: 1000, boolean: true }
      ]

    assert.deepEqual masked,
      masked: true
      array: [
        { string: '********', number: '***', boolean: '*' }
        { string: '**************', number: '****', boolean: '*' }
      ]


  it 'should mask array of objects with valid flags', ->
    masked = mask
      masked: false,
      array: [
        { string: 'a string', number: 103, boolean: false, valid: true }
        { string: 'another string', number: 1000, boolean: true, valid: false }
      ]

    assert.deepEqual masked,
      masked: true
      array: [
        { string: '********', number: '***', boolean: '*', valid: true }
        { string: '**************', number: '****', boolean: '*', valid: false }
      ]


  # this is the same form as 'rich types' (phone, ssn, email, etc.)
  it 'should mask String object with properties', ->
    str = new String("foobar")
    str.foo = 'bar'
    str.bar = 'bazz'
    str.masked = false
    str.valid = true
    masked = mask(str)
    assert.equal masked.foo, '***'
    assert.equal masked.bar, '****'
    assert.equal masked.toString(), '******'
    assert.isTrue masked.masked
    assert.isTrue masked.valid


  it 'should not mask twice', ->
    str = new String("foo***")
    str.masked = true
    masked = mask(str)
    assert.equal masked.toString(), 'foo***'
    assert.isTrue masked.masked


  it 'should handle function', ->
    str = new String("foo")
    str.masked = false
    str.foo = ->
    masked = mask(str)
    assert.equal masked.toString(), '***'
    assert.isTrue masked.masked
