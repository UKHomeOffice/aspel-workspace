const value = `Hello

The {{ roleName }} role application for {{ name }} has been {{ status }}.{{ statusLine }}

{{ identifier }}: {{ identifierValue }}

You can see more details about this task by visiting {{{ taskUrl }}}
`;

module.exports = {
  requires: ['roleName', 'name', 'identifier', 'identifierValue', 'status', 'taskUrl', 'statusLine'],
  value
};
