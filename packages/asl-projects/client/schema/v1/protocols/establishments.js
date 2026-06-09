import ProtocolEstablishments from '../../../pages/sections/granted/protocol-establishments';

export default {
  title: 'Establishments and POLEs',
  show: props => props.isGranted && !props.isFullApplication,
  granted: {
    order: 3,
    review: ProtocolEstablishments
  }
};

