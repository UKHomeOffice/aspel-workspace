const baseContent = require('../../content');
const merge = require('lodash/merge');

module.exports = merge(
  {},
  baseContent,
  {
    pageTitle: 'Apply for a cat E PIL',
    pageSubtitle: '{{ trainingCourse.title }}',
    breadcrumbs: {
      categoryE: {
        course: {
          addParticipant: 'Apply for a cat E PIL'
        }
      }
    },
    fields: {
      firstName: {
        label: 'First name'
      },
      lastName: {
        label: 'Last name'
      },
      email: {
        label: 'Email address'
      },
      dob: {
        label: 'Date of birth',
        hint: 'For example, 14 9 2023',
        checkAnswerLabel: 'Over 18'
      },
      organisation: {
        label: 'Organisation'
      },
      qualificationLevelAndSubject: {
        label: 'Qualification level and subject',
        hint: 'For example BSc Pharmacology'
      },
      applicantLearningUse: {
        label:
        'How will the participant use this learning in future scientific work using living animals?',
        checkAnswerLabel: 'Higher education or training outcomes',
        hint: 'Explain how they intend to use it to design, conduct or analyse research.'
      },
      jobTitleOrQualification: {
        label: 'Job title, career stage or qualification',
        hint: 'For example trainee doctor, consultant or registrar'
      },
      fieldOfExpertise: {
        label: 'Field of expertise',
        hint: 'For example head and neck surgeon'
      },
      applicantTrainingUseAtWork: {
        label: 'How will the participant use this training in their work?',
        checkAnswerLabel: 'Higher education or training outcomes'
      },
      otherNotes: {
        label: 'Other notes (optional)',
        checkAnswerLabel: 'Other notes'
      }
    },
    errors: {
      firstName: {
        required: 'Enter the first name of the participant'
      },
      lastName: {
        required: 'Enter the last name of the participant'
      },
      email: {
        required: 'Enter the email address of the participant',
        customValidate: 'Enter a valid email address'
      },
      dob: {
        required: 'Enter the date of birth of the participant',
        validDate: 'The date of birth of the participant must be a real date' +
          ' and include a day, month and year. The year must include 4 numbers',
        dateIsBefore: 'Date of birth must be in the past'
      },
      trainingNeed: {
        required: 'This is a required field'
      },
      organisation: {
        required: `Enter the participant's organisation`
      },
      qualificationLevelAndSubject: {
        required: `Enter the participant's qualification level and subject`
      },
      applicantTrainingUseAtWork: {
        lessThanOrEqualToMaxWordCount:
        'How the participant will use this training must be 100 words or less',
        required:
        'Tell us how the participant will use this training in their work'
      },
      applicantLearningUse: {
        lessThanOrEqualToMaxWordCount:
        'How the participant will use this learning must be 250 words or less',
        required:
        'Tell us how the participant will use this learning in future scientific work using living animals'
      },
      jobTitleOrQualification: {
        required: `Enter the participant's job title, career stage or qualification`
      },
      fieldOfExpertise: {
        required: `Enter the participant's field of expertise`
      }
    }
  }
);
