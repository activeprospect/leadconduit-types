const moment = require('moment');
const date = require('./date');
const normalize = require('../normalize');
const TENTH_OF_DAY_IN_MINUTES = 144;

const parse = function (string, req) {
  const parsed = date.parse(string, req);
  parsed.masked = false;

  if (parsed.valid) {
    const today = moment.utc().startOf('day').add(TENTH_OF_DAY_IN_MINUTES, 'minutes');
    const dob = moment.utc(parsed.toString(), 'YYYY-MM-DD');
    const yearsOld = moment.duration(today.diff(dob, 'years'), 'years').years();
    const lastBirthday = moment.utc(`${today.year()}-${dob.format('MM-DD')}`, 'YYYY-MM-DD');
    if (lastBirthday > today) {
      lastBirthday.subtract(1, 'year');
    }
    let duration = moment.duration(today.diff(lastBirthday)).asYears();
    if (duration > 0.9) {
      duration = 0.9;
    }

    // round to one decimal place
    parsed.age = yearsOld + Math.floor(duration * 10) / 10;
    parsed.year = dob.year();
  }

  return parsed;
};

const components = [
  { name: 'raw', type: 'string', description: 'The full date, only accessible to Integrations' },
  { name: 'age', type: 'number', description: 'The age of the consumer as of today, rounded down to one decimal place' },
  { name: 'year', type: 'number', description: 'The year from the DOB' }
];

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
};
