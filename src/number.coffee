module.exports =
  parse: (string) ->
    return string unless string?

    number = string

    try
      number = +string.replace(/[^0-9.]+/g, '')
      if number == 0 and isNaN(parseInt(string))
        number = string
    catch e

    parsed = new String(number)
    parsed.raw = string
    parsed



