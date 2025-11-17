const baseContent = require('../../content');
const merge = require('lodash/merge');

module.exports = merge(
  {},
  baseContent,
  {
    pageTitle: 'Manage course and participants',
    pageSubtitle: '{{trainingCourse.title}}',
    participantsHeader: 'Course participants',
    noParticipantsMessage: 'There are no participants yet for this course.',
    fields: {
      startDate: {
        label: 'Course date{{#trainingCourse.endDate}}s{{/trainingCourse.endDate}}'
      },
      coursePurpose: {
        label: 'Course purpose'
      },
      species: {
        label: 'Animals used'
      },
      projectTitle: {
        label: 'Project title'
      },
      projectLicenceNumber: {
        label: 'Project licence number'
      },
      profile: {
        label: 'Name'
      },
      organisation: {
        label: 'Organisation'
      },
      licenceDetails: {
        label: 'Details'
      },
      status: {
        label: 'Status'
      },
      action: {
        label: 'Action'
      }
    },
    actions: {
      updateCourse: 'Change course details',
      updateCourseDates: 'Change course dates',
      deleteCourse: 'Delete course',
      addParticipant: 'Apply for a cat E PIL'
    }
  }
);
