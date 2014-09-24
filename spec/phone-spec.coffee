assert = require('chai').assert
phone = require('../src/phone')


describe 'Phone', ->

  it 'should handle empty string', ->
    ph = phone.parse('')
    assert.equal ph, ''

  it 'should parse US phone', ->
    ph = phone.parse('5127891111')
    assert.equal ph.valueOf(), '5127891111'
    assert.equal ph.raw, '5127891111'
    assert.equal ph.area, '512'
    assert.equal ph.exchange, '789'
    assert.equal ph.line, '1111'
    assert.equal ph.number, '7891111'
    assert.equal ph.country_code, 'US'
    assert.isTrue ph.valid

  it 'should parse UK phone', ->
    ph = phone.parse '7981-555555'
#      assert.equal ph.valueOf(), '5127891111'
#      assert.equal ph.raw, '5127891111'
#      assert.equal ph.area, '512'
#      assert.equal ph.exchange, '789'
#      assert.equal ph.line, '1111'
#      assert.equal ph.number, '7891111'
#      assert.equal ph.country_code, 'US'

#  it 'should parse extension', ->
#    phone.parse '5127891111 x 1234', {}, (err, ph) ->
#      assert.equal ph.toString(), '5127891111'
#      assert.equal ph.extension, '1234'
#      done()
#
#  it 'should support United States', ->
#    assert phone.countryCodes.indexOf('US') != -1
#
#  it 'should support Canada', ->
#    assert phone.countryCodes.indexOf('CA') != -1
#
#  it 'should support UK', ->
#    assert phone.countryCodes.indexOf('GB') != -1
#
#  it 'should parse mobile hint', ->
#    phone.parse '5127891111m', {}, (err, ph) ->
#      assert.equal ph.raw, '5127891111'
#      assert.equal ph.type, 'mobile'
#      done()
#
#  it 'should parse cell hint', ->
#    phone.parse '5127891111c', {}, (err, ph) ->
#      assert.equal ph.raw, '5127891111'
#      assert.equal ph.type, 'mobile'
#      done()
#
#  it 'should parse work hint', ->
#    phone.parse '5127891111w', {}, (err, ph) ->
#      assert.equal ph.raw, '5127891111'
#      assert.equal ph.type, 'work'
#      done()
#
#  it 'should parse home hint', ->
#    phone.parse '5127891111h', {}, (err, ph) ->
#      assert.equal ph.raw, '5127891111'
#      assert.equal ph.type, 'home'
#      done()
#
#  it 'should parse hint on invalid number', ->
#    phone.parse '1111m', {}, (err, ph) ->
#      assert.equal ph.raw, '1111'
#      assert.equal ph.type, 'mobile'
#      done()
#
#  it 'should allow optional parentheses in hint', ->
#    phone.parse '5127891111(h)', {}, (err, ph) ->
#      assert.equal ph.raw, '5127891111'
#      assert.equal ph.type, 'home'
#      done()
#
#  it 'should allow optional whitespace before hint', ->
#    phone.parse '5127891111 h', {}, (err, ph) ->
#      assert.equal ph.raw, '5127891111'
#      assert.equal ph.type, 'home'
#      done()
#
#  it 'should strip leading and trailing whitespace', ->
#    phone.parse ' 5127891111 ', {}, (err, ph) ->
#      assert.equal ph.toString(), '5127891111'
#      assert.equal ph.raw, ' 5127891111 '
#      done()