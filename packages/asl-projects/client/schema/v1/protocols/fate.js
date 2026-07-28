import { markdownLink, getCurrentURLForFateOfAnimals } from '../../../helpers';
import NTSFateOfAnimalFields from '../../../helpers/nts-field';
import { withProtocolContext } from './helpers/with-protocol-context';

const baseHint = () => `Select all that apply. These options are based on what you selected in the ${markdownLink('non-technical summary', getCurrentURLForFateOfAnimals())}.`;

const standardProtocolHint = () => `Select all that apply. These options are based on what you selected in the ${markdownLink('non-technical summary', getCurrentURLForFateOfAnimals())} and what is permitted for this standard protocol.`;

export default {
  title: 'Fate of animals',
  show: ({ isGranted, isFullApplication }) => !isGranted || isFullApplication,
  granted: {
    order: 11
  },
  fields: [
    withProtocolContext(
      {
        name: 'fate',
        label: 'What will happen to animals at the end of this protocol?',
        hint: baseHint,
        type: 'checkbox',
        preserveHierarchy: true,
        className: 'smaller',
        options: Object.values(NTSFateOfAnimalFields())
      },
      {
        editable: {
          hint: standardProtocolHint
        },
        standard: {
          hint: standardProtocolHint
        }
      }
    )
  ]
};

