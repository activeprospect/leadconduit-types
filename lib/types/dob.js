const moment = require('moment');
const date = require('./date');
const normalize = require('../normalize');

const parse = function (string, req) {
  const parsed = date.parse(string, req);
  parsed.masked = false;

  if (parsed.valid) {
    // calculate precise age
    parsed.age = moment().diff(parsed, 'days')/365;
    // round to one decimal place
    parsed.age = Math.floor(parsed.age * 10)/10;
    parsed.year = moment(parsed).year();
  }

  return parsed;
}

const components = [
  { name: 'raw', type: 'string', description: 'The full date, only accessible to Integrations' },
  { name: 'age', type: 'number', description: 'The age of the consumer as of today, rounded down to one decimal place' },
  { name: 'year', type: 'number', description: 'The year from the DOB' }
]

module.exports = {
  parse,
  components,
  maskable: true,
  operators: [
    'is equal to',
    'is not equal to',
    'is less than',
    'is less than or equal to',
    'is greater than',
    'is greater than or equal to',
    'is blank',
    'is not blank',
    'format is valid',
    'format is invalid',
    'is between',
    'is not between'
  ],
  examples: [
    'Mon Jun 02 2014',
    'Jun 02 2014',
    '06/02/2014',
    '2014-06-02'
  ].map(parse).map(normalize)
}
