const value = `The request to remove {{ name }}'s {{ roleName }} role has been refused.

{{ identifier }}: {{ identifierValue }}

You can see more details about this task by visiting {{{ taskUrl }}}
`;

module.exports = {
  requires: ['roleName', 'name', 'identifier', 'identifierValue', 'taskUrl'],
  value
};
