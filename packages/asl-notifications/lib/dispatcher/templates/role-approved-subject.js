const value = `The {{ roleName }} role application for {{ name }} has been {{ status }}.{{ statusLine }}

{{ identifier }}: {{ identifierValue }}
`;

module.exports = {
  requires: ['roleName', 'name', 'identifier', 'identifierValue', 'status', 'statusLine'],
  value
};
