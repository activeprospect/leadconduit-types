assert = require('chai').assert
email = require('../src/email')


describe 'Email', ->

  it 'should return a String object', (done) ->
    email.parse 'user@domain.com', {}, (err, email) ->
      assert.instanceOf email, String
      done()

  it 'should parse user', (done) ->
    email.parse 'user@domain.com', {}, (err, email) ->
      assert.equal email.user, 'user'
      done()

  it 'should parse domain', (done) ->
    email.parse 'user@domain.com', {}, (err, email) ->
      assert.equal email.domain, 'domain.com'
      done()

  it 'should parse host', (done) ->
    email.parse 'user@domain.com', {}, (err, email) ->
      assert.equal email.host, 'domain'
      done()

  it 'should parse tld', (done) ->
    email.parse 'user@domain.com', {}, (err, email) ->
      assert.equal email.tld, 'com'
      done()

  it 'should retain raw value', (done) ->
    email.parse 'User@Domain.Com', {}, (err, email) ->
      assert.equal email.raw, 'User@Domain.Com'
      done()

  it 'should handle invalid value', (done) ->
    email.parse 'Asdf', {}, (err, email) ->
      assert.instanceOf email, String
      assert.equal email.raw, 'Asdf'
      assert.isUndefined email.user
      assert.isUndefined email.domain
      assert.isUndefined email.host
      assert.isUndefined email.tld
      done()
