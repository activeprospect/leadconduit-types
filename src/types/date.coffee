_ = require('lodash')
moment = require('moment')
normalize = require('../normalize')

# Because the  European formats come later in the `formats` array, the Date type should prefer non-euro formats (all things being equal).
# ie: '6/2/14' should be parsed as June 2nd, and not February 6th.
# Link to relevant Moment documentation: https://momentjs.com/docs/#/parsing/string-formats/
formats = [
  'ddd MMM DD YYYY' # 'Mon Jun 02 2014'
  'MMM DD YYYY'     # 'Jun 02 2014'
  'M/D/YYYY'        # '6/2/2014', '06/02/2014'
  'M/D/YY'          # '6/2/14'
  'YYYY-MM-DD'      # '2014-06-02'
  'MM-DD-YYYY'      # '06-02-2014'
  'MMDDYYYY'        # '06022014'
  'YYYYMMDD'        # '06022014'

  # European formats (month first)
  'ddd DD MMM YYYY'   # 'Fri 18 July 2014'
  'DD MMM YYYY'       # '18 July 2014'
  'D/M/YYYY'          # '18/7/2014'
  'D/M/YY'            # '18/7/14'
  'YYYY-DD-MM'        # '2014-18-07'
  'DD-MM-YYYY'        # '18-07-2014'
  'DDMMYYYY'          # '18072014'
  'YYYY-DD-MM'        # '2014-18-07' 
]


parse = (string, req) ->
  raw = string.raw ? string
  results = moment(string.toString(), formats, true)

  if !results.isValid()
    # strict mode parsing failed; log what failed and try again in forgiving mode [todo: this is temporary! 3/17]
    results = moment(string.toString(), formats)
    req?.logger?.info "strict mode date-parsing failed for [#{string}]; forgiving mode gave: #{results.toString()}"

  if results.isValid()
    parsed = results.toDate()
    parsed.raw = raw
    parsed.valid = true
    parsed.valueOf = ->
      @toString()
    parsed.toString = ->
      moment(@getTime()).format('YYYY-MM-DD')
  else
    parsed = new String(raw)
    parsed.raw = raw
    parsed.valid = false

  parsed

components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
]

module.exports =
  parse: parse
  components: components
  maskable: false
  operators: [
    'is equal to'
    'is not equal to'
    'is less than'
    'is less than or equal to'
    'is greater than'
    'is greater than or equal to'
    'is blank'
    'is not blank'
    'format is valid'
    'format is invalid'
    'is between'
    'is not between'
  ]
  examples: [
    'Mon Jun 02 2014'
    'Jun 02 2014'
    '06/02/2014'
    '2014-06-02'
  ].map(parse).map(normalize)
