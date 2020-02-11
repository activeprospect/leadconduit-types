_ = require 'lodash'

module.exports = (phone) ->
  return unless phone?.valid == true
  _.pick phone, 'type', 'country_code', 'prefix', 'area', 'exchange', 'is_tollfree'
