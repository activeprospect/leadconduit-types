assert = require('chai').assert
phone = require('../src/phone')


describe 'Phone', ->

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
      assert.equal ph.extension, '1234'
      done()

  it 'should support United States', ->
    assert phone.countryCodes.indexOf('US') != -1

  it 'should support Canada', ->
    assert phone.countryCodes.indexOf('CA') != -1

  it 'should support UK', ->
    assert phone.countryCodes.indexOf('GB') != -1