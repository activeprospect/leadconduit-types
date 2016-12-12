module.exports = (time) ->
  return unless time?.valid == true
  time.normal?.toISOString()
