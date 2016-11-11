module.exports = (state) ->
  return unless state?.valid == true
  state.valueOf()
