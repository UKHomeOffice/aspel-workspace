const value = `The request to remove {{ name }} from the role of {{ roleName }} has been returned.

{{ identifier }}: {{ identifierValue }}

You can see more details about this task by visiting {{{ taskUrl }}}
`;

module.exports = {
  requires: ['roleName', 'name', 'identifier', 'identifierValue', 'taskUrl'],
  value
};
