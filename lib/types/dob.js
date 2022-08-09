const moment = require('moment');
const date = require('./date');

const parse = function (string, req) {
  const parsed = date.parse(string, req);

  if (parsed.valid) {
    parsed.age = moment().diff(parsed, 'years');
    parsed.year = moment(parsed).year();
    console.log(parsed)
  }

  return parsed;
}

const components = [
  { name: 'raw', type: 'string', description: 'The full date, only accessible to Integrations' },
  { name: 'age', type: 'number', description: 'The age of the consumer, calculated as of today' },
  { name: 'year', type: 'number', description: 'The year from the DOB' }
]

module.exports = {
  parse,
  components,
  maskable: false,
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
  examples: []
}
