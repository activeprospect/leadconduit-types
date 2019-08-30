_ = require('lodash')
module.exports = (number) ->
  return unless number?.valid == true
  if _.isNumber(number)
    number.valueOf()
  else if number.normal?
    number.normal

