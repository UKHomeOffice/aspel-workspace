const value = `{{ name }} has been removed from the {{ roleName }} role.

{{ identifier }}: {{ identifierValue }}

You can see more details about this task by visiting {{{ taskUrl }}}
`;

module.exports = {
  requires: ['roleName', 'name', 'identifier', 'identifierValue', 'taskUrl', 'statusLine'],
  value
};
