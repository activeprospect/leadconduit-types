const _ = require('lodash');
const aggregations = require('./aggregations');

//
// Prepare the recipient event for aggregation.
//
//  Parameters:
//  - event: The recipient event
//  - fieldTypes: The description of the types to include in the aggregation. For example:
//                 {
//                   'vars.lead.state': 'state',
//                   'vars.lead.postal_code: 'postal_code',
//                   'briteverify.outcome': 'string',
//                   'briteverify.reason': 'string'
//                 }
//
//  Return: Object containing the data to aggregate. for example:
//          {
//             vars: {
//               lead: {
//                 state: 'TX',
//                 postal_code: {
//                   zip: '78704',
//                   country_code: 'US'
//                 }
//               }
//             },
//             briteverify: {
//               outcome: 'success',
//               reason: null
//             }
//          }
//
module.exports = function (event, fieldTypes) {
  const aggregateVars = {};

  for (const fieldId in fieldTypes) {
    const type = fieldTypes[fieldId];
    const aggregate = aggregations[type];
    let value;
    if (type === 'wildcard') {
      value = _.get(event, fieldId.slice(0, -2));
    } else {
      value = _.get(event, fieldId);
    }
    if (aggregate != null && value != null) {
      value = typeof aggregate === 'function'
        ? aggregate(value)
        : undefined;
    }
    if (value !== undefined) {
      if (type === 'wildcard') {
        _.set(aggregateVars, fieldId.slice(0, -2), value);
      } else {
        _.set(aggregateVars, fieldId, value);
      }
    }
  }

  return aggregateVars;
};
