assert = require('chai').assert
range = require('../src/range')


describe 'Range', ->

  it 'should support dash separator', ->
    r = range.parse '1 - 10'
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '1 - 10'
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5

  it 'should support "to" separator', ->
    r = range.parse '1 to 10'
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '1 to 10'
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5

  it 'should support arbitrary spaces in separator', ->
    r = range.parse '1     to      10'
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '1     to      10'
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5

  it 'should support greater than range', ->
    r = range.parse '10+'
    assert.equal r.toString(), '10+'
    assert.equal r.raw, '10+'
    assert.equal r.min, 10
    assert.isNull r.max
    assert.isNull r.avg

  it 'should support single integer', ->
    r = range.parse '10'
    assert.equal r.toString(), '10'
    assert.equal r.raw, '10'
    assert.equal r.min, 10
    assert.equal r.max, 10
    assert.equal r.avg, 10

  it 'should support single float', ->
    r = range.parse '5.5'
    assert.equal r.toString(), '5.5'
    assert.equal r.raw, '5.5'
    assert.equal r.min, 5.5
    assert.equal r.max, 5.5
    assert.equal r.avg, 5.5

  it 'should support arbitrary leading space', ->
    r = range.parse '      1 to 10'
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '      1 to 10'
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5

  it 'should support arbitrary trailing space', ->
    r = range.parse '1 to 10     '
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '1 to 10     '
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5
      