_ = require('lodash')
normalize = require('./normalize')
aggregations = require('./aggregations')

module.exports = (vars, fieldTypes) ->
  aggregateVars = {}

  for fieldId, type of fieldTypes
    aggregate = aggregations[type]
    value = _.get(vars, fieldId)
    value = aggregate?(value) if aggregate? and value?
    if value != undefined
      _.set(aggregateVars, fieldId, value)

  normalize(aggregateVars)


