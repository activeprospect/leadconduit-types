_ = require 'lodash'

module.exports = (range) ->
  return unless range.valid == true
  _.pick range, 'normal', 'min', 'max', 'avg', 'mid'
