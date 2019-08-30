_ = require('lodash')
module.exports = (boolean) ->
  return unless boolean?.valid == true
  if _.isBoolean(boolean)
    boolean.valueOf()
  else if boolean.normal?
    boolean.normal
