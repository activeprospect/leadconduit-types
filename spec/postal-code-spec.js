/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const postalCode = require('../lib/types/postal_code');


describe('Postal code', function() {

  it('should handle leading and trailing whitespace', function() {
    const pc = postalCode.parse('  78704  ');
    assert.equal(pc.toString(), '78704');
    assert.equal(pc.raw, '  78704  ');
    assert.equal(pc.zip, '78704');
    assert.isNull(pc.four);
    assert.equal(pc.country_code, 'US');
    return assert.isTrue(pc.valid);
  });

  it('should parse US 5 digit format', function() {
    const pc = postalCode.parse('78704');
    assert.equal(pc.toString(), '78704');
    assert.equal(pc.raw, '78704');
    assert.equal(pc.zip, '78704');
    assert.isNull(pc.four);
    assert.equal(pc.country_code, 'US');
    return assert.isTrue(pc.valid);
  });


  it('should parse US 5 digit plus 4 format', function() {
    const pc = postalCode.parse('78704-1234');
    assert.equal(pc.toString(), '78704-1234');
    assert.equal(pc.raw, '78704-1234');
    assert.equal(pc.zip, '78704');
    assert.equal(pc.four, '1234');
    assert.equal(pc.country_code, 'US');
    return assert.isTrue(pc.valid);
  });


  it('should ignore whitespace in US 5 digit plus 4 format', function() {
    const pc = postalCode.parse('78704   - 1234');
    assert.equal(pc.toString(), '78704-1234');
    assert.equal(pc.raw, '78704   - 1234');
    assert.equal(pc.zip, '78704');
    assert.equal(pc.four, '1234');
    assert.equal(pc.country_code, 'US');
    return assert.isTrue(pc.valid);
  });


  it('should not require dash in US 5 digit plus 4 format', function() {
    const pc = postalCode.parse('78704 1234');
    assert.equal(pc.toString(), '78704-1234');
    assert.equal(pc.raw, '78704 1234');
    assert.equal(pc.zip, '78704');
    assert.equal(pc.four, '1234');
    assert.equal(pc.country_code, 'US');
    return assert.isTrue(pc.valid);
  });


  it('should not require any delimiter in US 5 digit plus 4 format', function() {
    const pc = postalCode.parse('787041234');
    assert.equal(pc.toString(), '78704-1234');
    assert.equal(pc.raw, '787041234');
    assert.equal(pc.zip, '78704');
    assert.equal(pc.four, '1234');
    assert.equal(pc.country_code, 'US');
    return assert.isTrue(pc.valid);
  });


  it('should parse Canadian format', function() {
    const pc = postalCode.parse('q2e 4u7');
    assert.equal(pc.toString(), 'Q2E 4U7');
    assert.equal(pc.raw, 'q2e 4u7');
    assert.equal(pc.district, 'Q');
    assert.equal(pc.fsa, 'Q2E');
    assert.equal(pc.ldu, '4U7');
    assert.equal(pc.country_code, 'CA');
    return assert.isTrue(pc.valid);
  });


  it('should add whitespace to Canadian format', function() {
    const pc = postalCode.parse('q2e4u7');
    assert.equal(pc.toString(), 'Q2E 4U7');
    assert.equal(pc.raw, 'q2e4u7');
    assert.equal(pc.district, 'Q');
    assert.equal(pc.fsa, 'Q2E');
    assert.equal(pc.ldu, '4U7');
    assert.equal(pc.country_code, 'CA');
    return assert.isTrue(pc.valid);
  });


  it('should remove extraneous whitespace from Canadian format', function() {
    const pc = postalCode.parse('q2e      4u7');
    assert.equal(pc.toString(), 'Q2E 4U7');
    assert.equal(pc.raw, 'q2e      4u7');
    assert.equal(pc.district, 'Q');
    assert.equal(pc.fsa, 'Q2E');
    assert.equal(pc.ldu, '4U7');
    assert.equal(pc.country_code, 'CA');
    return assert.isTrue(pc.valid);
  });


  it('should parse UK format 1', function() {
    const pc = postalCode.parse('A1 1AA');
    assert.equal(pc.toString(), 'A1 1AA');
    assert.equal(pc.raw, 'A1 1AA');
    assert.equal(pc.outcode, 'A1');
    assert.equal(pc.incode, '1AA');
    assert.equal(pc.country_code, 'GB');
    return assert.isTrue(pc.valid);
  });


  it('should parse UK format 2', function() {
    const pc = postalCode.parse('A11 1AA');
    assert.equal(pc.toString(), 'A11 1AA');
    assert.equal(pc.raw, 'A11 1AA');
    assert.equal(pc.outcode, 'A11');
    assert.equal(pc.incode, '1AA');
    assert.equal(pc.country_code, 'GB');
    return assert.isTrue(pc.valid);
  });


  it('should parse UK format 3', function() {
    const pc = postalCode.parse('A1A 1AA');
    assert.equal(pc.toString(), 'A1A 1AA');
    assert.equal(pc.raw, 'A1A 1AA');
    assert.equal(pc.outcode, 'A1A');
    assert.equal(pc.incode, '1AA');
    assert.equal(pc.country_code, 'GB');
    return assert.isTrue(pc.valid);
  });


  it('should parse UK format 4', function() {
    const pc = postalCode.parse('AA11 1AA');
    assert.equal(pc.toString(), 'AA11 1AA');
    assert.equal(pc.raw, 'AA11 1AA');
    assert.equal(pc.outcode, 'AA11');
    assert.equal(pc.incode, '1AA');
    assert.equal(pc.country_code, 'GB');
    return assert.isTrue(pc.valid);
  });


  it('should parse UK format 5', function() {
    const pc = postalCode.parse('AA11A 1AA');
    assert.equal(pc.toString(), 'AA11A 1AA');
    assert.equal(pc.raw, 'AA11A 1AA');
    assert.equal(pc.outcode, 'AA11A');
    assert.equal(pc.incode, '1AA');
    assert.equal(pc.country_code, 'GB');
    return assert.isTrue(pc.valid);
  });


  it('should add whitespace to UK format 1', function() {
    const pc = postalCode.parse('A11AA');
    assert.equal(pc.toString(), 'A1 1AA');
    assert.equal(pc.raw, 'A11AA');
    assert.equal(pc.outcode, 'A1');
    assert.equal(pc.incode, '1AA');
    assert.equal(pc.country_code, 'GB');
    return assert.isTrue(pc.valid);
  });


  it('should parse UK format 2', function() {
    const pc = postalCode.parse('A111AA');
    assert.equal(pc.toString(), 'A11 1AA');
    assert.equal(pc.raw, 'A111AA');
    assert.equal(pc.outcode, 'A11');
    assert.equal(pc.incode, '1AA');
    assert.equal(pc.country_code, 'GB');
    return assert.isTrue(pc.valid);
  });


  it('should not parse garbage', function() {
    const pc = postalCode.parse('garbage');
    assert.equal(pc.toString(), 'garbage');
    assert.equal(pc.raw, 'garbage');
    return assert.isFalse(pc.valid);
  });


  it('should parse a parsed postal code', function() {
    const pc = postalCode.parse(postalCode.parse('78704 - 1234'));
    assert.equal(pc.toString(), '78704-1234');
    assert.equal(pc.raw, '78704 - 1234');
    assert.equal(pc.zip, '78704');
    assert.equal(pc.four, '1234');
    assert.equal(pc.country_code, 'US');
    return assert.isTrue(pc.valid);
  });


  it('should ignore trailing dash', function() {
    const pc = postalCode.parse(postalCode.parse('78704-'));
    assert.equal(pc.toString(), '78704');
    assert.equal(pc.raw, '78704-');
    assert.equal(pc.zip, '78704');
    assert.isNull(pc.four);
    assert.equal(pc.country_code, 'US');
    return assert.isTrue(pc.valid);
  });


  return it('should have examples', () => assert(postalCode.examples.length));
});
