import ExperimentalDesign from './pages/sections/experimental-design';
import Protocols from './pages/sections/protocols'

export default {
  introduction: {
    title: 'Project introduction',
    subsections: {
      details: {
        title: 'Project details',
        fields: [
          {
            name: 'title',
            required: true,
            label: 'Title',
            type: 'text'
          }
        ]
      }
    }
  },
  protocols: {
    title: 'Protocols',
    subsections: {
      protocols: {
        title: 'Protocols',
        name: 'protocols',
        component: Protocols,
        fields: [{
          name: 'title',
          label: 'Title',
          type: 'text'
        },
        {
          name: 'description',
          label: 'Describe what you will use this protocol for',
          type: 'textarea',
        },
        {
          name: 'severity',
          label: 'What\'s the prospective severity classification of this protocol?',
          type: 'radio',
          options: [
            'Mild',
            'Moderate',
            'Severe',
            'Non-recovery'
          ]
        }],
        species: {
          name: 'species',
          title: 'Species',
          fields: [{
            name: 'species',
            label: 'Which species will be used in this protocol',
            type: 'radio',
            options: [
              'Mice',
              'Rats'
            ]
          }]
        },
        steps: {
          name: 'steps',
          title: 'Step',
          fields: [{
            name: 'title',
            label: 'Title',
            type: 'text'
          },
          {
            name: 'description',
            label: 'Please describe the step',
            type: 'textarea'
          },
          {
            name: 'optional',
            label: 'Is this step optional?',
            type: 'radio',
            options: [
              'Yes',
              'No'
            ]
          }]
        }
      }
    }
  },
  'project-plan': {
    title: 'Project plan',
    subsections: {
      'sandwich-design': {
        title: 'Sandwich design',
        component: ExperimentalDesign,
        fields: [
          {
            name: 'bread',
            label: 'What kind of bread would you like in your sandwich?',
            type: 'radio',
            options: [
              'White',
              'Brown'
            ],
            step: 0
          },
          {
            name: 'meat',
            label: 'What kind of meat would you like in your sandwich?',
            type: 'radio',
            options: [
              'Chicken',
              'Pork',
              'Beef'
            ],
            step: 0
          },
          {
            name: 'salad',
            label: 'What salads would you like included in your sandwich?',
            type: 'checkbox',
            options: [
              'Lettuce',
              'Tomato',
              'Cucumber'
            ],
            step: 1
          },
          {
            name: 'additional-instructions',
            label: 'Are there any additional requests?',
            type: 'texteditor',
            step: 2
          }
        ]
      }
    }
  }
}
