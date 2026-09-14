const value = `{{ name }} has been removed from the {{ roleName }} role. This is a PEL amendment.

{{ identifier }}: {{ identifierValue }}
`;

module.exports = {
  requires: ['roleName', 'name', 'identifier', 'identifierValue', 'statusLine'],
  value
};
