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
  fields: {
    dateRange: {
      label: 'Filter by date granted',
      hint: 'You can only download data:\n\n- from 31 July 2019, when ASPeL came into use\n- for date ranges of 6 months or less'
    },
    ra: {
      label: 'Which type of non-technical summary do you want to download? (docx file)',
      options: {
        true: 'Projects requiring a retrospective assessment (RA)',
        false: 'Projects not requiring an RA'
      }
    }
  },
  errors: {
    dateRange: {
      maximumDateRange: 'End date must be within 6 months of the start date',
      dateIsAfter: 'End date must be the same as or after {{date}}, the start date'
    },
    'date-from': {
      required: 'Enter a start date',
      aspelDataStartDate: 'Start date must be the same as or after 31 July 2019, when ASPeL came into use',
      date: {
        incomplete: 'Start date must include {{missingParts}}',
        yearLength: 'Year must include 4 numbers',
        realDate: 'Start date must be a real date',
        todayOrPast: 'Start date must be today or in the past'
      }
    },
    'date-to': {
      required: 'Enter an end date',
      aspelDataStartDate: 'End date must be the same as or after 31 July 2019, when ASPeL came into use',
      date: {
        incomplete: 'End date must include {{missingParts}}',
        yearLength: 'Year must include 4 numbers',
        realDate: 'End date must be a real date',
        todayOrPast: 'End date must be today or in the past',
        after: 'End date must be the same as or after {{date}}, the start date'
      }
    },
    ra: {
      required: 'Select which type of non-technical summary you want to download'
    },
    noResults: {
      noResults: 'There are no projects for this date range'
    }
  },
  links: {
    taskMetrics: 'Tasks processed by duration and decision for {{month}} {{year}} (ZIP)'
  }
};
