assert = require('chai').assert
postalCode = require('../src/postal-code')


describe 'Postal code', ->

  it 'should parse US 5 digit format', ->
    pc = postalCode.parse '78704'
    assert.equal pc.toString(), '78704'
    assert.equal pc.raw, '78704'
    assert.equal pc.zip, '78704'
    assert.isUndefined pc.four
    assert.equal pc.country_code, 'US'
      

  it 'should parse US 5 digit plus 4 format', ->
    pc = postalCode.parse '78704-1234'
    assert.equal pc.toString(), '78704-1234'
    assert.equal pc.raw, '78704-1234'
    assert.equal pc.zip, '78704'
    assert.equal pc.four, '1234'
    assert.equal pc.country_code, 'US'
      

  it 'should ignore whitespace in US 5 digit plus 4 format', ->
    pc = postalCode.parse '78704   - 1234'
    assert.equal pc.toString(), '78704-1234'
    assert.equal pc.raw, '78704   - 1234'
    assert.equal pc.zip, '78704'
    assert.equal pc.four, '1234'
    assert.equal pc.country_code, 'US'
      

  it 'should not require dash in US 5 digit plus 4 format', ->
    pc = postalCode.parse '78704 1234'
    assert.equal pc.toString(), '78704-1234'
    assert.equal pc.raw, '78704 1234'
    assert.equal pc.zip, '78704'
    assert.equal pc.four, '1234'
    assert.equal pc.country_code, 'US'
      

  it 'should not require any delimiter in US 5 digit plus 4 format', ->
    pc = postalCode.parse '787041234'
    assert.equal pc.toString(), '78704-1234'
    assert.equal pc.raw, '787041234'
    assert.equal pc.zip, '78704'
    assert.equal pc.four, '1234'
    assert.equal pc.country_code, 'US'
      


  it 'should parse Canadian format', ->
    pc = postalCode.parse 'q2e 4u7'
    assert.equal pc.toString(), 'Q2E 4U7'
    assert.equal pc.raw, 'q2e 4u7'
    assert.equal pc.district, 'Q'
    assert.equal pc.fsa, 'Q2E'
    assert.equal pc.ldu, '4U7'
    assert.equal pc.country_code, 'CA'
      

  it 'should add whitespace to Canadian format', ->
    pc = postalCode.parse 'q2e4u7'
    assert.equal pc.toString(), 'Q2E 4U7'
    assert.equal pc.raw, 'q2e4u7'
    assert.equal pc.district, 'Q'
    assert.equal pc.fsa, 'Q2E'
    assert.equal pc.ldu, '4U7'
    assert.equal pc.country_code, 'CA'
      

  it 'should remove extraneous whitespace from Canadian format', ->
    pc = postalCode.parse 'q2e      4u7'
    assert.equal pc.toString(), 'Q2E 4U7'
    assert.equal pc.raw, 'q2e      4u7'
    assert.equal pc.district, 'Q'
    assert.equal pc.fsa, 'Q2E'
    assert.equal pc.ldu, '4U7'
    assert.equal pc.country_code, 'CA'
      


  it 'should parse UK format 1', ->
    pc = postalCode.parse 'A1 1AA'
    assert.equal pc.toString(), 'A1 1AA'
    assert.equal pc.raw, 'A1 1AA'
    assert.equal pc.outcode, 'A1'
    assert.equal pc.incode, '1AA'
    assert.equal pc.country_code, 'GB'
      

  it 'should parse UK format 2', ->
    pc = postalCode.parse 'A11 1AA'
    assert.equal pc.toString(), 'A11 1AA'
    assert.equal pc.raw, 'A11 1AA'
    assert.equal pc.outcode, 'A11'
    assert.equal pc.incode, '1AA'
    assert.equal pc.country_code, 'GB'
      

  it 'should parse UK format 3', ->
    pc = postalCode.parse 'A1A 1AA'
    assert.equal pc.toString(), 'A1A 1AA'
    assert.equal pc.raw, 'A1A 1AA'
    assert.equal pc.outcode, 'A1A'
    assert.equal pc.incode, '1AA'
    assert.equal pc.country_code, 'GB'
      

  it 'should parse UK format 4', ->
    pc = postalCode.parse 'AA11 1AA'
    assert.equal pc.toString(), 'AA11 1AA'
    assert.equal pc.raw, 'AA11 1AA'
    assert.equal pc.outcode, 'AA11'
    assert.equal pc.incode, '1AA'
    assert.equal pc.country_code, 'GB'
      

  it 'should parse UK format 5', ->
    pc = postalCode.parse 'AA11A 1AA'
    assert.equal pc.toString(), 'AA11A 1AA'
    assert.equal pc.raw, 'AA11A 1AA'
    assert.equal pc.outcode, 'AA11A'
    assert.equal pc.incode, '1AA'
    assert.equal pc.country_code, 'GB'
    

  it 'should add whitespace to UK format 1', ->
    pc = postalCode.parse 'A11AA'
    assert.equal pc.toString(), 'A1 1AA'
    assert.equal pc.raw, 'A11AA'
    assert.equal pc.outcode, 'A1'
    assert.equal pc.incode, '1AA'
    assert.equal pc.country_code, 'GB'
      

  it 'should parse UK format 2', ->
    pc = postalCode.parse 'A111AA'
    assert.equal pc.toString(), 'A11 1AA'
    assert.equal pc.raw, 'A111AA'
    assert.equal pc.outcode, 'A11'
    assert.equal pc.incode, '1AA'
    assert.equal pc.country_code, 'GB'
      