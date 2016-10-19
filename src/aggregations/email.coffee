_ = require 'lodash'

module.exports = (email) ->
  return unless email?.valid == true
  _.pick email, 'domain', 'host', 'tld'
