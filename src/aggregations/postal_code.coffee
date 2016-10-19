_ = require 'lodash'

module.exports = (postalCode) ->
  return unless postalCode?.valid == true
  _.omit postalCode, 'four'
