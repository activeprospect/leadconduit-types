_ = require 'lodash'

module.exports = (range) ->
  return unless range.valid == true
  if _.isString(range)
    aggregated = _.pick range, 'min', 'max', 'avg', 'mid'
    aggregated.normal = range.valueOf()
    aggregated
  else
    _.pick range, 'normal', 'min', 'max', 'avg', 'mid'
