assert = require('chai').assert
phone = require('../src/phone')


describe 'Phone', ->

  it 'should handle empty string', (done) ->
    phone.parse '', {}, (err, ph) ->
      assert.equal ph.valueOf(), ''
      assert.equal ph.raw, ''
      done()

  it 'should parse US phone', (done) ->
    phone.parse '5127891111', {}, (err, ph) ->
      assert.equal ph.valueOf(), '5127891111'
      assert.equal ph.raw, '5127891111'
      assert.equal ph.area, '512'
      assert.equal ph.exchange, '789'
      assert.equal ph.line, '1111'
      assert.equal ph.number, '7891111'
      assert.equal ph.country_code, 'US'
      done()

  it 'should parse extension', (done) ->
    phone.parse '5127891111 x 1234', {}, (err, ph) ->
      assert.equal ph.toString(), '5127891111'
      assert.equal ph.extension, '1234'
      done()

  it 'should support United States', ->
    assert phone.countryCodes.indexOf('US') != -1

  it 'should support Canada', ->
    assert phone.countryCodes.indexOf('CA') != -1

  it 'should support UK', ->
    assert phone.countryCodes.indexOf('GB') != -1

  it 'should parse mobile hint', (done) ->
    phone.parse '5127891111m', {}, (err, ph) ->
      assert.equal ph.raw, '5127891111'
      assert.equal ph.type, 'mobile'
      done()

  it 'should parse cell hint', (done) ->
    phone.parse '5127891111c', {}, (err, ph) ->
      assert.equal ph.raw, '5127891111'
      assert.equal ph.type, 'mobile'
      done()

  it 'should parse work hint', (done) ->
    phone.parse '5127891111w', {}, (err, ph) ->
      assert.equal ph.raw, '5127891111'
      assert.equal ph.type, 'work'
      done()

  it 'should parse home hint', (done) ->
    phone.parse '5127891111h', {}, (err, ph) ->
      assert.equal ph.raw, '5127891111'
      assert.equal ph.type, 'home'
      done()

  it 'should parse hint on invalid number', (done) ->
    phone.parse '1111m', {}, (err, ph) ->
      assert.equal ph.raw, '1111'
      assert.equal ph.type, 'mobile'
      done()

  it 'should allow optional parentheses in hint', (done) ->
    phone.parse '5127891111(h)', {}, (err, ph) ->
      assert.equal ph.raw, '5127891111'
      assert.equal ph.type, 'home'
      done()

  it 'should allow optional whitespace before hint', (done) ->
    phone.parse '5127891111 h', {}, (err, ph) ->
      assert.equal ph.raw, '5127891111'
      assert.equal ph.type, 'home'
      done()

  it 'should strip leading and trailing whitespace', (done) ->
    phone.parse ' 5127891111 ', {}, (err, ph) ->
      assert.equal ph.toString(), '5127891111'
      assert.equal ph.raw, ' 5127891111 '
      done()