module.exports = {
  title: {
    label: 'Course title',
    hint: 'For your records'
  },
  coursePurpose: {
    label: 'Course purpose'
  },
  courseDuration: {
    label: `Course date{{#trainingCourse.endDate}}s{{/trainingCourse.endDate}}`
  },
  startDate: {
    label: 'Course start date',
    hint: `This helps ensure the licences are approved in time. Licences will be valid for 3 months from the date of approval.

For example, 12 11 2020`
  },
  species: {
    label: 'Animals used'
  },
  projectId: {
    label: 'Project licence number',
    hint: 'For a higher education and training project'
  },
  projectTitle: {
    label: 'Project title'
  },
  establishment: {
    label: 'Training establishment'
  },
  issueDate: {
    label: 'Issue date'
  },
  expiryDate: {
    label: 'Project licence expiry date'
  }
};
