const value = `{{ name }} has been removed from the {{ roleName }} role.

{{ identifier }}: {{ identifierValue }}
`;

module.exports = {
  requires: ['roleName', 'name', 'identifier', 'identifierValue', 'statusLine'],
  value
};
