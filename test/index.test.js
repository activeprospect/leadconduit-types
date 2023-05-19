const { assert } = require('chai');
const fs = require('fs');
const path = require('path');
const index = require('../lib');
const dob = require('../lib/types/dob');

describe('Index', function () {
  it('should list type names', function () {
    const files = fs.readdirSync(path.resolve(__dirname, '../lib/types'));
    const expectedTypeNames = files.map(f => path.basename(f, '.js'));
    expectedTypeNames.splice(expectedTypeNames.indexOf('index'), 1);

    assert.deepEqual(index.names, expectedTypeNames);
  });

  it('should not try to parse an non-type (e.g., array)', function () {
    const parsed = index.parse('array', [1, 3, 5]);
    assert.deepEqual(parsed, [1, 3, 5]);
  });

  it('should not parse a value twice', function () {
    const parsed = index.parse('phone', '5127891111');
    assert.equal(index.parse('phone', parsed), parsed);
  });

  it('should not parse an invalid value twice', function () {
    const parsed = index.parse('phone', 'dog');
    assert.equal(index.parse('phone', parsed), parsed);
  });

  it('should clone a value', function () {
    const obj = {
      phone: index.parse('phone', '5127891111'),
      ssn: index.parse('ssn', '123456789')
    };
    const objClone = index.clone(obj);
    assert.deepEqual(objClone, obj);
  });

  describe('hide utility', function () {
    describe('shouldHide', function () {
      it('returns true for dob type', function () {
        const normalizedDob = index.normalize(dob.parse('01-01-2000'));
        assert.isTrue(index.shouldHide(normalizedDob));
      });

      it('returns false for non-hideable type', function () {
        const normalizedString = index.normalize('string');
        assert.isFalse(index.shouldHide(normalizedString));
      });
    });

    describe('getHideableType', function () {
      it('returns null for non-hideable type', function () {
        // tests getHideableType()
        const normalizedString = index.normalize('string');
        assert.isNull(index.getHideableType(normalizedString));
      });

      it('returns dob for dob type', function () {
        const normalizedDob = index.normalize(dob.parse('01-01-2000'));
        assert.equal(index.getHideableType(normalizedDob), 'dob');
      });
    });

    it('partially hide dob data', function () {
      const normalizedDob = index.normalize(dob.parse('01-01-2000'));
      const hidden = index.hide(normalizedDob);
      assert.equal(hidden.raw, '**/**/2000');
      assert.equal(hidden.normal, '**/**/2000');
      assert.equal(hidden.year, 2000);
      // check that age is still a number
      assert.isTrue(Number.isFinite(Number.parseFloat(hidden.age)));
      assert.isTrue(hidden.valid);
    });

    it('does not hide non-hideable type', function () {
      const normalizedString = index.normalize('string');
      const hidden = index.hide(normalizedString);
      assert.equal(hidden, normalizedString);
    });
  });
});
