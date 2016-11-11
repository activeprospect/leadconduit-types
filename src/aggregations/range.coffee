_ = require 'lodash'

module.exports = (range) ->
  return unless range.valid == true
  rtn = _.pick range, 'min', 'max', 'avg', 'mid'
  rtn.normal = range.toString()
  rtn
