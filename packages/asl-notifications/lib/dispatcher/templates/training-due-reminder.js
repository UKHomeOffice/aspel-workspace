const value = `Hello
{{ name }}'s {{ roleType }} mandatory training is due to be completed by {{ completeDate }}.
Establishment name: {{ establishmentName }}
Once completed, ensure the training is added to their training record.
`;

module.exports = {
  requires: ['name', 'roleType', 'completeDate', 'establishmentName'],
  value
};
