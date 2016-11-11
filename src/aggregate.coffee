_ = require('lodash')
normalize = require('./normalize')
aggregations = require('./aggregations')

#
# Prepare the recipient event for aggregation.
#
#  Parameters:
#  - event: The recipient event
#  - fieldTypes: The description of the types to include in the aggregation. For example:
#                 {
#                   'vars.lead.state': 'state',
#                   'vars.lead.postal_code: 'postal_code',
#                   'briteverify.outcome': 'string',
#                   'briteverify.reason': 'string'
#                 }
#
#  Return: Object containing the data to aggregate. for example:
#          {
#             vars: {
#               lead: {
#                 state: 'TX',
#                 postal_code: {
#                   zip: '78704',
#                   country_code: 'US'
#                 }
#               }
#             },
#             briteverify: {
#               outcome: 'success',
#               reason: null
#             }
#          }
#
module.exports = (event, fieldTypes) ->
  aggregateVars = {}

  for fieldId, type of fieldTypes
    aggregate = aggregations[type]
    value = _.get(event, fieldId)
    value = aggregate?(value) if aggregate? and value?
    if value != undefined
      _.set(aggregateVars, fieldId, value)

  normalize(aggregateVars)


