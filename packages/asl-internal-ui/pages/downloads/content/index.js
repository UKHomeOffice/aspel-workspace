module.exports = {
  pageTitle: 'Downloads',
  'project-application': 'PPL applications',
  'project-amendment': 'PPL amendments',
  'project-revoke': 'PPL revocations',
  'pil-application': 'PIL applications',
  'pil-amendment': 'PIL amendments',
  'pil-revoke': 'PIL revocations',
  'pil-transfer': 'PIL transfers',
  'completed-pil-reviews': 'Completed PIL reviews',
  'role-create': 'Named people assignments',
  'role-delete': 'Named people revocations',
  'place-update': 'Approved area amendments',
  'place-create': 'Approved area additions',
  'place-delete': 'Approved area deletions',
  'profile-update': 'Profile updates',
  errors: {
    'date-from': {
      required: "Enter a 'From' date",
      aspelDataStartDate: "The 'From' date must be the same as or after 31 July 2019, when ASPeL came into use"
    },
    'date-to': {
      required: "Enter a 'To' date",
      aspelDataStartDate: "The 'To' date must be the same as or after 31 July 2019, when ASPeL came into use",
      date: {
        after: "The 'To' date must be the same as or after {{date}}, the 'From' date"
      }
    },
    ra: {
      required: 'Select which type of non-technical summary to download'
    }
  },
  links: {
    taskMetrics: 'Tasks processed by duration and decision for {{month}} {{year}} (ZIP)'
  }
};
