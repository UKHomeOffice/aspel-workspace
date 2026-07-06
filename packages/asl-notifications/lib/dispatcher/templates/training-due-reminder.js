const value = `{{ fullName }}’s {{ type }} is due to be completed by {{ completeDate }}.
Establishment name: {{ name }}
Once completed, ensure the {{ trainingRecordLabel }} is added to {{ their }} training record.
`;

module.exports = {
  requires: ['fullName', 'type', 'completeDate', 'name', 'trainingRecordLabel', 'their'],
  value
};
