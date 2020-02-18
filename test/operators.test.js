const { assert } = require('chai');
const types = require('../lib');
const rules = require('@activeprospect/leadconduit-rules');

const supportedOperators = Object.keys(rules.operators);

describe('Operators', function () {
  for (const name of types.names) {
    it(`${name} type should only allow valid operators`, function () {
      for (const op of types[name].operators) {
        assert(supportedOperators.indexOf(op) >= 0, `The ${op} operator is not supported by LeadConduit`);
      }
    });
  }
});
