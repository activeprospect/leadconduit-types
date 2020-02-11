/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const email = require('../lib/types/email');


describe('Email', function() {

  it('should return a String object', () => assert.instanceOf(email.parse('user@domain.com'), String));

  it('should parse user', () => assert.equal(email.parse('user@domain.com').user, 'user'));

  it('should support plus symbol in user', () => assert.equal(email.parse('user+hola@domain.com').user, 'user+hola'));

  it('should parse domain', () => assert.equal(email.parse('user@domain.com').domain, 'domain.com'));

  it('should parse host', () => assert.equal(email.parse('user@domain.com').host, 'domain'));

  it('should parse tld', () => assert.equal(email.parse('user@domain.com').tld, 'com'));

  it('should correctly determine if account is from free domain', function() {
    assert.equal(email.parse('user@domain.com').is_free, false);
    return assert.equal(email.parse('user@gmail.com').is_free, true);
  });

  it('should correctly determine if email account is disposable', function() {
    assert.equal(email.parse('user@domain.com').is_disposable, false);
    return assert.equal(email.parse('user@mailinator.com').is_disposable, true);
  });

  it('should retain raw value', () => assert.equal(email.parse('User@Domain.Com').raw, 'User@Domain.Com'));

  it('should be valid', () => assert.isTrue(email.parse('user@domain.com').valid));

  it('should handle invalid value', function() {
    const parsed = email.parse('Asdf');
    assert.instanceOf(parsed, String);
    assert.equal(parsed.raw, 'Asdf');
    assert.isUndefined(parsed.user);
    assert.isUndefined(parsed.domain);
    assert.isUndefined(parsed.host);
    assert.isUndefined(parsed.tld);
    return assert.isFalse(parsed.valid);
  });

  it('should downcase', () => assert.equal(email.parse('User@Domain.Com').toString(), 'user@domain.com'));

  it('should strip whitespace', function() {
    const parsed = email.parse(' user@domain.com ');
    assert.equal('user@domain.com', parsed.toString());
    return assert.equal(' user@domain.com ', parsed.raw);
  });

  it('should handle parsing a parsed email', function() {
    const parsed = email.parse(email.parse('USER@domain.com'));
    assert.instanceOf(parsed, String);
    assert.equal(parsed.toString(), 'user@domain.com');
    return assert.equal(parsed.raw, 'USER@domain.com');
  });

  return it('should have examples', () => assert(email.examples.length));
});
