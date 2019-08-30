_ = require('lodash')
moment = require('moment')

module.exports = (date) ->
  return unless date?.valid == true
  if _.isDate(date)
    moment(date).format('YYYY-MM-DD')
  else
    return unless date.normal?
    moment(date.normal).format('YYYY-MM-DD')
