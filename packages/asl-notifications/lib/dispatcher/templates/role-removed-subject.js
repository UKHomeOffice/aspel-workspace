const value = `{{ name }} has been removed from the role of {{ roleName }}.{{ statusLine }}

{{ identifier }}: {{ identifierValue }}
`;

module.exports = {
  requires: ['roleName', 'name', 'identifier', 'identifierValue', 'statusLine'],
  value
};
