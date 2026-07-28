import { withProtocolContext } from '../schema/v1/protocols/helpers/with-protocol-context';
import { showFateOfAnimals } from './show-fate-of-animals';

export default function NTSFateOfAnimalFields() {
  return {
    'killed': {
      label: 'Killed',
      value: 'killed',
      hint: 'Ensure you describe the methods of killing to be used in the final step of this protocol.',
      show: values => showFateOfAnimals(values, 'killed'),
      reveal: withProtocolContext(
        {
          label: 'Will you be using non-schedule 1 killing methods on a conscious animal?',
          name: 'non-schedule-1',
          type: 'radio',
          className: 'smaller',
          inline: true,
          options: [
            {
              label: 'Yes',
              value: true,
              reveal: withProtocolContext(
                {
                  name: 'method-and-justification',
                  label: 'For each non-schedule 1 method, explain why this is necessary.',
                  type: 'texteditor'
                },
                {
                  standard: {
                    type: 'paragraph'
                  }
                }
              )
            },
            {
              label: 'No',
              value: false
            }
          ]
        },
        {
          standard: {
            label: 'Non-schedule 1 killing methods on a conscious animal',
            type: 'standard-radio'
          }
        }
      )
    },
    'continued-use': {
      label: 'Continued use on another protocol in this project',
      value: 'continued-use',
      show: values => showFateOfAnimals(values, 'continued-use'),
      reveal: withProtocolContext(
        {
          name: 'continued-use-relevant-project',
          label: 'Please state the relevant protocol.',
          type: 'texteditor'
        },
        {
          standard: {
            type: 'paragraph'
          }
        }
      )
    },
    'continued-use-2': withProtocolContext(
      {
        label: 'Continued use on other projects',
        value: 'continued-use-2',
        show: values => showFateOfAnimals(values, 'continued-use-2')
      },
      {
        standard: {
          hint: 'Animals may be transferred to other projects authorised to use the same animal types '
        },
        editable: {
          hint: 'Animals may be transferred to other projects authorised to use the same animal types '
        }
      }
    ),
    'set-free': {
      label: 'Set free',
      value: 'set-free',
      show: values => showFateOfAnimals(values, 'set-free')
    },
    'rehomed': {
      label: 'Rehomed',
      value: 'rehomed',
      show: values => showFateOfAnimals(values, 'rehomed')
    },
    'kept-alive': {
      label: 'Kept alive at a licensed establishment for non-regulated purposes or possible reuse',
      hint: 'Non-regulated purposes could include handling, breeding or non-regulated procedures.',
      value: 'kept-alive',
      show: values => showFateOfAnimals(values, 'kept-alive')
    }
  };
}

