const dictionary = require('@asl/dictionary');

module.exports = {
  site: {
    title: 'Site',
    match: (value, test) => value === test
  },
  suitability: {
    title: 'Suitability',
    match: (value, test) => value.includes(test),
    label: code => `${dictionary[code]} (${code})`,
    combines: 'AND'
  },
  holding: {
    title: 'Holding',
    match: (value, test) => value.includes(test),
    label: code => `${dictionary[code]} (${code})`,
    combines: 'AND'
  }
};
