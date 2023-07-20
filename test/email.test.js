const { assert } = require('chai');
const email = require('../lib/types/email');

describe('Email', function () {
  it('should return a String object', function () {
    assert.instanceOf(email.parse('user@domain.com'), String);
  });

  it('should parse user', function () {
    assert.equal(email.parse('user@domain.com').user, 'user');
  });

  it('should support plus symbol in user', function () {
    assert.equal(email.parse('user+hola@domain.com').user, 'user+hola');
  });

  it('should parse domain', function () {
    assert.equal(email.parse('user@domain.com').domain, 'domain.com');
  });

  it('should parse host', function () {
    assert.equal(email.parse('user@domain.com').host, 'domain');
  });

  it('should parse tld', function () {
    assert.equal(email.parse('user@domain.com').tld, 'com');
  });

  it('should correctly determine if account is from free domain', function () {
    assert.equal(email.parse('user@domain.com').is_free, false);
    assert.equal(email.parse('user@gmail.com').is_free, true);
  });

  it('should correctly determine if email account is disposable', function () {
    assert.equal(email.parse('user@domain.com').is_disposable, false);
    assert.equal(email.parse('user@mailinator.com').is_disposable, true);
  });

  it('should retain raw value', function () {
    assert.equal(email.parse('User@Domain.Com').raw, 'User@Domain.Com');
  });

  it('should be valid', function () {
    assert.isTrue(email.parse('user@domain.com').valid);
  });

  it('should handle invalid value', function () {
    const parsed = email.parse('Asdf');
    assert.instanceOf(parsed, String);
    assert.equal(parsed.raw, 'Asdf');
    assert.isUndefined(parsed.user);
    assert.isUndefined(parsed.domain);
    assert.isUndefined(parsed.host);
    assert.isUndefined(parsed.tld);
    assert.isFalse(parsed.valid);
  });

  it('should ignore embedded spaces', function () {
    ['p. j. butter@gmail.com', 'peace_carols@hotmail. Co'].forEach((badEmail) => {
      const parsed = email.parse(badEmail);
      assert.instanceOf(parsed, String);
      // valueOf should be the cleaned-up version of the input: lowercased, with no spaces
      assert.equal(parsed.valueOf(), badEmail.toLowerCase().replace(/\s/g, ''));
      assert.equal(parsed.raw, badEmail);
      assert.isTrue(parsed.valid);
      assert.isDefined(parsed.user);  // not checking these values too closely, defined is good enough...
      assert.isDefined(parsed.domain);
      assert.isDefined(parsed.host);
      assert.isDefined(parsed.tld);
    });
  });

  it('should handle non-string garbage', function () {
    // see sc-39505
    let parsed, stringified;
    const invokeStringify = () => {
      parsed = email.parse({ foo: 42 });
      stringified = JSON.stringify(parsed);
    };
    assert.doesNotThrow(invokeStringify);

    assert.equal(stringified, '"[object Object]"');
    assert.equal(parsed.toString(), '[object Object]');
    assert.equal(parsed.raw, '[object Object]');
    assert.equal(parsed.valueOf(), '[object Object]');
    assert.isFalse(parsed.valid);
  });

  it('should downcase', function () {
    assert.equal(email.parse('User@Domain.Com').toString(), 'user@domain.com');
  });

  it('should strip whitespace', function () {
    const parsed = email.parse(' user@domain.com ');
    assert.equal('user@domain.com', parsed.toString());
    assert.equal(' user@domain.com ', parsed.raw);
  });

  it('should handle parsing a parsed email', function () {
    const parsed = email.parse(email.parse('USER@domain.com'));
    assert.instanceOf(parsed, String);
    assert.equal(parsed.toString(), 'user@domain.com');
    assert.equal(parsed.raw, 'USER@domain.com');
  });

  it('should have examples', function () {
    assert(email.examples.length);
  });
});
