import capitalize from 'lodash/capitalize';

const listFormatter = list => {
  if (!list || list.length < 1) {
    return 'None selected';
  }

  return list.map(item => item === 'procedure' ? 'Procedures' : capitalize(item)).join(', ');
};

export default {
  licences: {
    format: listFormatter
  },
  authorisations: {
    format: listFormatter
  }
};
