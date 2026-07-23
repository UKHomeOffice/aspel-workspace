import { markdownLink, getCurrentURLForFateOfAnimals } from '../../../helpers';
import NTSFateOfAnimalFields from '../../../helpers/nts-field';

export default {
  title: 'Fate of animals',
  show: ({ isGranted, isFullApplication }) => !isGranted || isFullApplication,
  granted: {
    order: 11
  },
  fields: [
    {
      name: 'fate',
      label: 'What will happen to animals at the end of this protocol?',
      hint: () => `Select all that apply. These options are based on what you selected in the ${markdownLink('non-technical summary', getCurrentURLForFateOfAnimals())} and what is permitted for this standard protocol.`,
      type: 'checkbox',
      preserveHierarchy: true,
      className: 'smaller',
      options: Object.values(NTSFateOfAnimalFields())
    }
  ]
};

