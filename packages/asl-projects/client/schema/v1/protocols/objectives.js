import ProtocolObjectives from '../../../pages/sections/granted/protocol-objectives';

export default {
  title: 'Objectives',
  show: props => props.isGranted && !props.isFullApplication,
  granted: {
    order: 6,
    review: ProtocolObjectives
  }
};

