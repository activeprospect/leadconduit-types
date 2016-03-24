assert = require('chai').assert
phone = require('../src/types/phone')


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
    assert.isUndefined ph.is_tollfree
    assert.isFalse ph.valid

  it 'should set valid to false for invalid phone numbers', ->
    ph = phone.parse('964523331')
    assert.equal ph.valueOf(), '964523331'
    assert.equal ph.raw, '964523331'
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
    assert.isFalse ph.is_tollfree
    assert.isTrue ph.valid

  it 'should parse US toll-free phone', ->
    ph = phone.parse('8775551212')
    assert.equal ph.valueOf(), '8775551212'
    assert.equal ph.raw, '8775551212'
    assert.equal ph.area, '877'
    assert.equal ph.exchange, '555'
    assert.equal ph.line, '1212'
    assert.equal ph.number, '5551212'
    assert.equal ph.country_code, 'US'
    assert.isUndefined ph.masked
    assert.isTrue ph.is_tollfree
    assert.isTrue ph.valid

  it 'should include extension in normal form', ->
    ph = phone.parse('5127891111x123')
    assert.equal ph.valueOf(), '5127891111x123'
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
    assert.isFalse ph.is_tollfree
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
    assert.isFalse ph.is_tollfree
    assert.isTrue ph.valid

  it 'should parse masked US phone with extension', ->
    ph = phone.parse('1-(512) *** **** x**')
    assert.equal ph.valueOf(), '512*******x**'
    assert.equal ph.raw, '1-(512) *** **** x**'
    assert.equal ph.area, '512'
    assert.equal ph.exchange, '***'
    assert.equal ph.line, '****'
    assert.equal ph.number, '*******'
    assert.equal ph.extension, '**'
    assert.equal ph.country_code, 'US'
    assert.isNull ph.type
    assert.isTrue ph.masked
    assert.isFalse ph.is_tollfree
    assert.isTrue ph.valid

  it 'should parse masked US phone with unmasked extension', ->
    ph = phone.parse('1-(512) *** **** x42')
    assert.equal ph.valueOf(), '512*******x42'
    assert.equal ph.raw, '1-(512) *** **** x42'
    assert.equal ph.area, '512'
    assert.equal ph.exchange, '***'
    assert.equal ph.line, '****'
    assert.equal ph.number, '*******'
    assert.equal ph.extension, '42'
    assert.equal ph.country_code, 'US'
    assert.isNull ph.type
    assert.isTrue ph.masked
    assert.isFalse ph.is_tollfree
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
    assert.isFalse ph.is_tollfree
    assert.isTrue ph.valid

  it 'should parse mobile hint', ->
    ph = phone.parse '5127891111m'
    assert.equal ph.raw, '5127891111'
    assert.equal ph.type, 'mobile'

  it 'should parse cell hint', ->
    ph = phone.parse '5127891111c'
    assert.equal ph.raw, '5127891111'
    assert.equal ph.type, 'mobile'

  it 'should parse work hint', ->
    ph = phone.parse '5127891111w'
    assert.equal ph.raw, '5127891111'
    assert.equal ph.type, 'work'

  it 'should parse home hint', ->
    ph = phone.parse '5127891111h'
    assert.equal ph.raw, '5127891111'
    assert.equal ph.type, 'home'

  it 'should parse hint on invalid number', ->
    ph = phone.parse '1111m'
    assert.equal ph.raw, '1111'
    assert.equal ph.type, 'mobile'

  it 'should allow optional parentheses in hint', ->
    ph = phone.parse '5127891111(h)'
    assert.equal ph.raw, '5127891111'
    assert.equal ph.type, 'home'

  it 'should allow optional whitespace before hint', ->
    ph = phone.parse '5127891111 h'
    assert.equal ph.raw, '5127891111'
    assert.equal ph.type, 'home'

  it 'should strip leading and trailing whitespace', ->
    ph = phone.parse ' 5127891111 '
    assert.equal ph.toString(), '5127891111'
    assert.equal ph.raw, ' 5127891111 '

  it 'should parse a parsed phone', ->
    ph = phone.parse(phone.parse('512-789-1111'))
    assert.equal ph.valueOf(), '5127891111'
    assert.equal ph.raw, '512-789-1111'
    assert.isTrue ph.valid

  it 'should have examples', ->
    assert phone.examples.length

  it 'should produce JSON', ->
    assert.equal JSON.stringify(phone.parse('512-789-1111m')), '{"raw":"512-789-1111","type":"mobile","prefix":"1","normal":"5127891111","country_code":"US","area":"512","number":"7891111","extension":null,"exchange":"789","line":"1111","valid":true}'
