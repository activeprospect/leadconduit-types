assert = require('chai').assert
phone = require('../src/phone')


describe 'Phone', ->

  it 'should handle empty string', ->
    ph = phone.parse('')
    assert.equal ph, ''

  it 'should handle non-phone string', ->
    ph = phone.parse('donkey kong')
    assert.equal ph.valueOf(), 'donkey kong'
    assert.equal ph.raw, 'donkey kong'
    assert.isUndefined ph.area
    assert.isUndefined ph.exchange
    assert.isUndefined ph.line
    assert.isUndefined ph.number
    assert.isUndefined ph.country_code
    assert.isUndefined ph.type
    assert.isUndefined ph.masked
    assert.isFalse ph.valid

  it 'should parse US phone', ->
    ph = phone.parse('5127891111')
    assert.equal ph.valueOf(), '5127891111'
    assert.equal ph.raw, '5127891111'
    assert.equal ph.area, '512'
    assert.equal ph.exchange, '789'
    assert.equal ph.line, '1111'
    assert.equal ph.number, '7891111'
    assert.equal ph.country_code, 'US'
    assert.isUndefined ph.masked
    assert.isTrue ph.valid

  it 'should parse US phone extension', ->
    assert.equal phone.parse('5127891111').extension, null
    assert.equal phone.parse('5127891111x42').extension, '42'
    assert.equal phone.parse('5127891111 x43').extension, '43'
    assert.equal phone.parse('5127891111 x 44').extension, '44'


  it 'should parse masked US phone', ->
    ph = phone.parse('1-(512) *** ****')
    assert.equal ph.valueOf(), '512*******'
    assert.equal ph.raw, '1-(512) *** ****'
    assert.equal ph.area, '512'
    assert.equal ph.exchange, '***'
    assert.equal ph.line, '****'
    assert.equal ph.number, '*******'
    assert.equal ph.country_code, 'US'
    assert.isNull ph.type
    assert.isTrue ph.masked
    assert.isTrue ph.valid


  it 'should parse partially masked US phone', ->
    ph = phone.parse('1-(5*2) *** **11')
    assert.equal ph.valueOf(), '5*2*****11'
    assert.equal ph.raw, '1-(5*2) *** **11'
    assert.equal ph.area, '5*2'
    assert.equal ph.exchange, '***'
    assert.equal ph.line, '**11'
    assert.equal ph.number, '*****11'
    assert.equal ph.country_code, 'US'
    assert.isNull ph.type
    assert.isTrue ph.masked
    assert.isTrue ph.valid


  it 'should handle completely masked US phone', ->
    ph = phone.parse('**********')
    assert.equal ph.valueOf(), '**********'
    assert.equal ph.raw, '**********'
    assert.equal ph.area, '***'
    assert.equal ph.exchange, '***'
    assert.equal ph.line, '****'
    assert.equal ph.number, '*******'
    assert.equal ph.country_code, 'US'
    assert.isTrue ph.masked
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


  it 'should support United States', ->
    assert phone.countryCodes.indexOf('US') != -1

  it 'should support Canada', ->
    assert phone.countryCodes.indexOf('CA') != -1

  it 'should support UK', ->
    assert phone.countryCodes.indexOf('GB') != -1

  it 'should parse mobile hint', ->
    phone.parse '5127891111m', {}, (err, ph) ->
      assert.equal ph.raw, '5127891111'
      assert.equal ph.type, 'mobile'
      done()

  it 'should parse cell hint', ->
    phone.parse '5127891111c', {}, (err, ph) ->
      assert.equal ph.raw, '5127891111'
      assert.equal ph.type, 'mobile'
      done()

  it 'should parse work hint', ->
    phone.parse '5127891111w', {}, (err, ph) ->
      assert.equal ph.raw, '5127891111'
      assert.equal ph.type, 'work'
      done()

  it 'should parse home hint', ->
    phone.parse '5127891111h', {}, (err, ph) ->
      assert.equal ph.raw, '5127891111'
      assert.equal ph.type, 'home'
      done()

  it 'should parse hint on invalid number', ->
    phone.parse '1111m', {}, (err, ph) ->
      assert.equal ph.raw, '1111'
      assert.equal ph.type, 'mobile'
      done()

  it 'should allow optional parentheses in hint', ->
    phone.parse '5127891111(h)', {}, (err, ph) ->
      assert.equal ph.raw, '5127891111'
      assert.equal ph.type, 'home'
      done()

  it 'should allow optional whitespace before hint', ->
    phone.parse '5127891111 h', {}, (err, ph) ->
      assert.equal ph.raw, '5127891111'
      assert.equal ph.type, 'home'
      done()

  it 'should strip leading and trailing whitespace', ->
    phone.parse ' 5127891111 ', {}, (err, ph) ->
      assert.equal ph.toString(), '5127891111'
      assert.equal ph.raw, ' 5127891111 '
      done()


  it 'should parse a parsed phone', ->
    ph = phone.parse(phone.parse('512-789-1111'))
    assert.equal ph.valueOf(), '5127891111'
    assert.equal ph.raw, '512-789-1111'
    assert.isTrue ph.valid