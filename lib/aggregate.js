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
    let value, wildcardFieldId;
    // adding wildcard fields to aggregateVars to be able to send them to keen and generate this kind of advanced reports
    // https://app.shortcut.com/active-prospect/story/31155/group-by-does-not-work-for-appended-data-fields-in-reports
    if (type === 'wildcard') {
      // remove suffix '.*' from fieldId
      wildcardFieldId = fieldId.slice(0, -2);
      value = _.get(event, wildcardFieldId);
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
        // This _set line will add more than one field in the aggregateVars due the wildcard types are usually object
        _.set(aggregateVars, wildcardFieldId, value);
      } else {
        _.set(aggregateVars, fieldId, value);
      }
    }
  }

  return aggregateVars;
};
