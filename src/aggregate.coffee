_ = require('lodash')
normalize = require('./normalize')
aggregations = require('./aggregations')

module.exports = (vars, fieldTypes) ->
  for fieldId, type of fieldTypes
    aggregate = aggregations[type]
    continue unless aggregate?
    lead = {}
    value = _.get(vars, "lead.#{fieldId}")
    if value?
      valueForAggregation = aggregate?(value)
      _.set(lead, fieldId, valueForAggregation) if valueForAggregation?

  vars.lead = lead

  normalize(vars)


