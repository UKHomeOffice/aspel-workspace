const value = `Hello
{{ applicant.firstName}} {{applicant.lastName} }}'s {{ type }} mandatory training is due to be completed by {{ completeDate }}.
Establishment name: {{ establishmentName }}
Once completed, ensure the training is added to their training record.
`;

module.exports = {
  requires: ['applicant', 'type', 'completeDate', 'establishmentName'],
  value
};
