const _ = require('lodash');
const { assert } = require('chai');
const index = require('../lib');

describe('Examples', function () {
  for (const typeName of Object.keys(index)) {
    const type = index[typeName];
    if (type.examples && type.examples.length) {
      it(`should be valid for ${typeName}`, function () {
        for (const example of type.examples) {
          if (_.isPlainObject(example)) {
            assert(example.valid, `${typeName} has an invalid example: ${JSON.stringify(example)}`);
          }
        }
      });
    }
  }

  describe('expand', function () {
    beforeEach(function () {
      this.field = {
        id: 'tellie',
        type: 'phone',
        examples: ['512-788-1111']
      };
    });

    it('should expand based on type', function () {
      index.expandExamples(this.field);
      assert.deepEqual(this.field.examples, [{
        normal: '5127881111',
        raw: '512-788-1111',
        area: '512',
        exchange: '788',
        line: '1111',
        number: '7881111',
        extension: null,
        is_tollfree: false,
        country_code: 'US',
        country_calling_code: 1,
        type: null,
        valid: true
      }
      ]);
    });

    it('should re-expand expanded examples', function () {
      index.expandExamples(this.field);
      this.field.examples[0].prefix = '2';

      index.expandExamples(this.field);
      assert.deepEqual(this.field.examples, [{
        normal: '5127881111',
        raw: '512-788-1111',
        area: '512',
        exchange: '788',
        line: '1111',
        number: '7881111',
        extension: null,
        is_tollfree: false,
        country_code: 'US',
        country_calling_code: 1,
        type: null,
        valid: true
      }
      ]);
    });
  });
});
