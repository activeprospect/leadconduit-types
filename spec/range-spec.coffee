assert = require('chai').assert
range = require('../src/range')


describe 'Range', ->

  it 'should support dash separator', (done) ->
    range.parse '1 - 10', {}, (err, r) ->
      return done(err) if err
      assert.equal r.toString(), '1-10'
      assert.equal r.raw, '1 - 10'
      assert.equal r.min, 1
      assert.equal r.max, 10
      assert.equal r.avg, 5.5
      done()


  it 'should support "to" separator', (done) ->
    range.parse '1 to 10', {}, (err, r) ->
      return done(err) if err
      assert.equal r.toString(), '1-10'
      assert.equal r.raw, '1 to 10'
      assert.equal r.min, 1
      assert.equal r.max, 10
      assert.equal r.avg, 5.5
      done()

  it 'should support arbitrary spaces in separator', (done) ->
    range.parse '1     to      10', {}, (err, r) ->
      return done(err) if err
      assert.equal r.toString(), '1-10'
      assert.equal r.raw, '1     to      10'
      assert.equal r.min, 1
      assert.equal r.max, 10
      assert.equal r.avg, 5.5
      done()

  it 'should support greater than range', (done) ->
    range.parse '10+', {}, (err, r) ->
      return done(err) if err
      assert.equal r.toString(), '10+'
      assert.equal r.raw, '10+'
      assert.equal r.min, 10
      assert.isNull r.max
      assert.isNull r.avg
      done()

  it 'should support single integer', (done) ->
    range.parse '10', {}, (err, r) ->
      return done(err) if err
      assert.equal r.toString(), '10'
      assert.equal r.raw, '10'
      assert.equal r.min, 10
      assert.equal r.max, 10
      assert.equal r.avg, 10
      done()

  it 'should support single float', (done) ->
    range.parse '5.5', {}, (err, r) ->
      return done(err) if err
      assert.equal r.toString(), '5.5'
      assert.equal r.raw, '5.5'
      assert.equal r.min, 5.5
      assert.equal r.max, 5.5
      assert.equal r.avg, 5.5
      done()

  it 'should support arbitrary leading space', (done) ->
    range.parse '      1 to 10', {}, (err, r) ->
      return done(err) if err
      assert.equal r.toString(), '1-10'
      assert.equal r.raw, '      1 to 10'
      assert.equal r.min, 1
      assert.equal r.max, 10
      assert.equal r.avg, 5.5
      done()

  it 'should support arbitrary trailing space', (done) ->
    range.parse '1 to 10     ', {}, (err, r) ->
      return done(err) if err
      assert.equal r.toString(), '1-10'
      assert.equal r.raw, '1 to 10     '
      assert.equal r.min, 1
      assert.equal r.max, 10
      assert.equal r.avg, 5.5
      done()