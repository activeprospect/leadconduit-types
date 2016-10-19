_ = require('lodash')
normalize = require('./normalize')
aggregations = require('./aggregations')

module.exports = (vars, fieldTypes) ->
  aggregateVars = {}

  for fieldId, type of fieldTypes

    aggregate = aggregations[type]
    continue unless aggregate?

    value = _.get(vars, fieldId)
    continue unless value?

    aggregateVars[fieldId] = aggregate(value)

  normalize(aggregateVars)


