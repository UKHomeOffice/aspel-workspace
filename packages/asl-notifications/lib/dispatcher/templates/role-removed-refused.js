const value = `The request for {{ name }}'s to be removed from the role of  {{ roleName }} has been refused.

{{ identifier }}: {{ identifierValue }}

You can see more details about this task by visiting {{{ taskUrl }}}
`;

module.exports = {
  requires: ['roleName', 'name', 'identifier', 'identifierValue', 'taskUrl'],
  value
};
