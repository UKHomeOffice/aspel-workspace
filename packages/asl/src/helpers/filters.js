const dictionary = require('@asl/dictionary');

module.exports = [
  {
    title: 'Site',
    key: 'site',
    match: (value, test) => value === test
  },
  {
    title: 'Suitability',
    key: 'suitability',
    match: (value, test) => value.includes(test),
    label: code => `${dictionary[code]} (${code})`,
    combines: 'AND'
  },
  {
    title: 'Holding',
    key: 'holding',
    match: (value, test) => value.includes(test),
    label: code => `${dictionary[code]} (${code})`,
    combines: 'AND'
  }
];
