import GrantedSteps from '../../../pages/sections/granted/protocol-steps';
import { markdownLink, getToGeneralConstraints } from '../../../helpers';
import { withProtocolContext } from './helpers/with-protocol-context';

export default {
  title: 'Steps',
  hint: 'A step can be a single procedure or a combination of procedures to achieve an outcome. You will be able to reorder your steps at any time before you send your application to the Home Office, but they should be broadly chronological, with the final step being a method of killing or the last regulated procedure.',
  footer: 'Once you’ve created a list of steps, you need to add information about adverse effects, controls and limitations, and humane endpoints to each one.',
  repeats: 'steps',
  granted: {
    order: 7,
    review: GrantedSteps
  },
  fields: [
    withProtocolContext(
      {
        name: 'title',
        type: 'texteditor',
        label: 'Describe the procedures that will be carried out during this step.',
        hint: `Explain where one or more steps are repeated in one experiment, list any alternative techniques within a step (e.g. dosing routes), and include all procedures performed under terminal anaesthesia.

When describing the technical aspects of a step, be broad enough to be flexible when the variation does not impact on animal welfare (e.g. use "antibiotic" instead of "penicillin"). Finally, avoid specifying volumes and frequencies when they do not impact on animal welfare.`
      },
      {
        editable: {
          type: 'texteditor',
          label: 'Describe the procedures that will be carried out during this step',
          hint: `You should: \n
• explain where one or more steps are repeated in one experiment \n
• list any alternative techniques within a step (for example dosing routes) \n
• include all procedures performed under terminal anaesthesia \n
When describing the technical aspects of a step, be broad enough to be flexible when the variation does not affect animal welfare (for example, use 'antibiotic' instead of 'penicillin').

Avoid specifying volumes and frequencies when they do not affect animal welfare.`
        },
        standard: {
          type: 'paragraph',
          label: 'Permitted procedures for this step',
          hint: null
        }
      }
    ),
    withProtocolContext(
      {
        name: 'reference',
        type: 'text',
        label: 'Step reference',
        hint: 'Provide a short reference for this step, e.g. \'Blood sampling\' or \'Transgene induction\'',
        show: props => props?.isStandardProtocol === true ? false : !props?.readonly
      },
      {
        editable: {
          type: 'text'
        },
        standard: {
          type: 'paragraph'
        }
      }
    ),
    {
      name: 'optional',
      label: 'Is this step optional?',
      type: 'radio',
      inline: true,
      className: 'smaller',
      options: [
        {
          label: 'Yes',
          value: true
        },
        {
          label: 'No',
          value: false
        }
      ],
      show: props => props?.isStandardProtocol !== true
    },
    withProtocolContext(
      {
        name: 'adverse',
        label: 'Do you expect this step to have adverse effects for the animals that are more than mild and transient?',
        hint: 'Do not list uncommon or unlikely adverse effects, or effects from procedures that will cause no more than transient discomfort and no lasting harm. For example, an intravenous injection of a small volume of an innocuous substance.',
        type: 'radio',
        inline: true,
        className: 'smaller',
        options: [
          {
            label: 'Yes',
            value: true,
            reveal: [
              withProtocolContext(
                {
                  name: 'adverse-effects',
                  label: 'What are the likely adverse effects of this step?',
                  hint: 'State the expected adverse effect, including the likely incidence, and the anticipated degree and duration of suffering.',
                  type: 'texteditor'
                },
                {
                  editable: {
                    type: 'texteditor'
                  },
                  standard: {
                    type: 'paragraph'
                  }
                }
              ),
              withProtocolContext(
                {
                  name: 'prevent-adverse-effects',
                  label: 'How will you monitor for, control, and limit any of these adverse effects?',
                  hint: 'If adverse effects can\'t be prevented, how will you attempt to ameliorate their initial signs?',
                  type: 'texteditor'
                },
                {
                  editable: {
                    type: 'texteditor'
                  },
                  standard: {
                    type: 'paragraph'
                  }
                }
              ),
              withProtocolContext(
                {
                  name: 'endpoints',
                  label: 'What are the humane endpoints for this step?',
                  hint: 'This would be the point at which you would kill the animal to prevent further suffering.',
                  type: 'texteditor'
                },
                {
                  editable: {
                    type: 'texteditor'
                  },
                  standard: {
                    type: 'paragraph'
                  }
                }
              )
            ]
          },
          {
            label: 'No',
            value: false
          }
        ]
      },
      {
        editable: {
          label: `Do you expect this step to have adverse effects that are more than mild and short-term and not listed in ${markdownLink('General constraints', getToGeneralConstraints())}?`,
          hint: `Do not list uncommon or unlikely adverse effects, or effects from procedures that will cause no more than transient discomfort and no lasting harm. For example, an intravenous injection of a small volume of an innocuous substance.`,
          type: 'radio'
        },
        standard: {
          label: `Expected adverse effects that are more than mild and short-term and not listed in ${markdownLink('General constraints', getToGeneralConstraints())}`,
          hint: null,
          type: 'standard-radio'
        }
      }
    ),
    {
      name: 'reusable',
      label: 'Do you want to be able to use this step on other protocols?',
      type: 'radio',
      inline: true,
      className: 'smaller',
      options: [
        {
          label: 'Yes',
          value: true
        },
        {
          label: 'No',
          value: false
        }
      ],
      show: props => props?.isStandardProtocol === true ? false : !props?.readonly
    }
  ]
};
