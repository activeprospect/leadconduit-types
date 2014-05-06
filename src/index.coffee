typeNames = [
  'phone',
]

module.exports = {}
typeNames.forEach (name) ->
  module.exports[name] = require("./#{name}")
