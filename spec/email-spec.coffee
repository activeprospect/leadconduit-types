assert = require('chai').assert
email = require('../src/email')


describe 'Email', ->

  it 'should return a String object', ->
    assert.instanceOf email.parse('user@domain.com'), String

  it 'should parse user', ->
    assert.equal email.parse('user@domain.com').user, 'user'

  it 'should support plus symbol in user', ->
    assert.equal email.parse('user+hola@domain.com').user, 'user+hola'

  it 'should parse domain', ->
    assert.equal email.parse('user@domain.com').domain, 'domain.com'

  it 'should parse host', ->
    assert.equal email.parse('user@domain.com').host, 'domain'

  it 'should parse tld', ->
    assert.equal email.parse('user@domain.com').tld, 'com'

  it 'should retain raw value', ->
    assert.equal email.parse('User@Domain.Com').raw, 'User@Domain.Com'

  it 'should be valid', ->
    assert.isTrue email.parse('user@domain.com').valid

  it 'should handle invalid value', ->
    parsed = email.parse 'Asdf'
    assert.instanceOf parsed, String
    assert.equal parsed.raw, 'Asdf'
    assert.isUndefined parsed.user
    assert.isUndefined parsed.domain
    assert.isUndefined parsed.host
    assert.isUndefined parsed.tld
    assert.isFalse parsed.valid

  it 'should downcase', ->
    assert.equal email.parse('User@Domain.Com').toString(), 'user@domain.com'

  it 'should strip whitespace', ->
    parsed = email.parse(' user@domain.com ')
    assert.equal 'user@domain.com', parsed.toString()
    assert.equal ' user@domain.com ', parsed.raw

  it 'should handle parsing a parsed email', ->
    parsed = email.parse(email.parse('USER@domain.com'))
    assert.instanceOf parsed, String
    assert.equal parsed.toString(), 'user@domain.com'
    assert.equal parsed.raw, 'USER@domain.com'

  it 'should have examples', ->
    assert email.examples.length

