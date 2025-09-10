const value = `{{ fullName }}'s {{ type }} mandatory training is due to be completed by {{ completeDate }}.
Establishment name: {{ name }}
Once completed, ensure the training is added to their training record.
`;

module.exports = {
  requires: ['fullName', 'type', 'completeDate', 'name'],
  value
};
