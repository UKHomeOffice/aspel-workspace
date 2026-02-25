const listOfRoles = require('../../content/named-roles');

// eslint-disable-next-line no-warning-comments
//TODO: There is another file with same name named-roles.js. When named person flag is removed, both files should be combined to give the final list of roles
// https://collaboration.homeoffice.gov.uk/jira/browse/ASL-4716
module.exports = Object.entries(listOfRoles).reduce((acc, [key, value]) => {
  // 'pelh' role may need to be removed from the list of roles for named person but is not decided yet, so keeping it in the list for now. Once the decision is made, the code can be uncommented to remove 'pelh' role from the list of roles.
  // if (key !== 'pelh') {
    acc[key] = value;
  // }
  return acc;
}, {});
