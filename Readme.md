# LeadConduit Rules

This Node.JS module handles evaluation of rules.

[![Build Status](https://magnum.travis-ci.com/activeprospect/leadconduit-rules.svg?token=482wC8iv8U56UifHfWLx)](https://magnum.travis-ci.com/activeprospect/leadconduit-rules)


## Usage

The exported module function asynchronously evaluates an array of rules, given a lead data object (context).

### Array of rules

Each rule has the following properties:
 * `lhv` &mdash; left hand value is a key to look up a value from the lead data context
 * `op` &mdash; operator String name (see what's supported in src/operators)
 * `rhv` &mdash; right hand value (omit for unary operators like `is blank`)
 * `rules` &mdash; optional additional array of rules to be ANDed with the rule

The array of rules may also include the `mode` property set to `any` or `all` (defaults to `all`). Mode determines whether
all of the rules in the array must pass, or whether just one must pass.

### Evaluation context

When rules are processed the `lhv` will be resolved to a value using the data in the context. For example, if the `lhv`
is "lead.first_name" and the context is `{ "lead": { "first_name": "Bob" } }`, then the resolved `lhv` will be "Bob".

### Completion callback

The completion callback will be invoked after processing the rules. The callback provides one parameter:

 * `error` &mdash; If the rules failed, then error's message is the reason. Otherwise, the error parameter will be `null`.


### Example

```javascript
var evaluateRules = require('leadconduit-rules');

var rules = [
  {
    lhv: 'lead.state',
    op: 'is equal to',
    rhv: 'TX',
    rules: [
      {
        lhv: 'lead.city',
        op: 'is equal to',
        rhv: 'Austin'
      }
    ]
  },
  {
    lhv: 'lead.last_name',
    op: 'is equal to',
    rhv: 'Jones'
  }
];

rules.mode = 'all'

var context = {
  lead: {
    last_name: 'Jones',
    city: 'Austin',
    state: 'TX'
  }
};

evaluateRules(context, rules, function(err) {
  // no error because rules match the data provided in the context!
});
```




