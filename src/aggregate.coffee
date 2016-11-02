_ = require('lodash')
normalize = require('./normalize')
aggregations = require('./aggregations')

module.exports = (vars, fieldTypes) ->
  for fieldId, type of fieldTypes
    aggregate = aggregations[type]
    lead = {}
    value = _.get(vars, "lead.#{fieldId}")
    if aggregate? and value?
      value = aggregate?(value)
    _.set(lead, fieldId, value) if value?

  vars.lead = lead

  normalize(vars)


