_ = require('lodash')
assert = require('chai').assert
types = require('../src/types')
mask = require('../src/mask')

describe 'Mask utility', ->

  for Ctor in _.values(types)
    continue unless Ctor.maskable
    do (Ctor) ->

      describe Ctor.name, ->

        it 'should be masked', ->
          raw = Ctor.examples[0].raw
          masked = mask(new Ctor(raw))
          unmasked = new Ctor(raw)
          assertMasked(masked, unmasked)


        it 'should masked in deeply nested object', ->
          raw = Ctor.examples[0].raw
          masked = mask(foo: { bar: new Ctor(raw)}).foo.bar
          unmasked = new Ctor(raw)
          assertMasked(masked, unmasked)


        it 'should masked in array', ->
          raw = Ctor.examples[0].raw
          masked = mask([new Ctor(raw)])[0]
          unmasked = new Ctor(raw)
          assertMasked(masked, unmasked)


        it 'should masked in deeply nested array', ->
          raw = Ctor.examples[0].raw
          masked = mask(foo: { bar: [ 'foo', new Ctor(raw) ]}).foo.bar[1]
          unmasked = new Ctor(raw)
          assertMasked(masked, unmasked)


        it 'should have no ill-effect from masking twice', ->
          raw = Ctor.examples[0].raw
          masked = mask(mask(new Ctor(raw)))
          unmasked = new Ctor(raw)
          assertMasked(masked, unmasked)


  for Ctor in _.values(types)
    continue if Ctor.maskable
    do (Ctor) ->

      describe Ctor.name, ->

        it 'should not mask', ->
          raw = Ctor.examples[0].raw
          masked = mask(new Ctor(raw))
          unmasked = new Ctor(raw)
          assert.deepEqual masked, unmasked





assertMasked = (masked, unmasked) ->
  # ensure valid property is not touched
  assert.isTrue masked.valid

  # test toString
  assert.equal masked.toString(), unmasked.toString().replace(/./g, '*')

  # test the normal property if necessary
  assert.equal masked.normal, unmasked.normal.toString().replace(/./g, '*') if unmasked.normal

  # test all components
  for component in masked.constructor.components
    assert.equal masked[component.name], unmasked[component.name].toString().replace(/./g, '*')

