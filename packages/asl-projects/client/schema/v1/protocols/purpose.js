import Purpose from '../../../pages/sections/granted/protocol-purpose';

export default {
  title: 'Purpose and outputs',
  show: props => props.isGranted && !props.isFullApplication,
  granted: {
    order: 2,
    review: Purpose
  }
};

