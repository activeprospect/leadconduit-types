moment = require('moment')

module.exports = (date) ->
  return unless date?.valid == true
  return unless date.normal?
  moment(date.normal).format('YYYY-MM-DD')
