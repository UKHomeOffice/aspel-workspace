import { isProtocolPlaybackMode } from '../../../helpers';
import { withProtocolContext } from './helpers/with-protocol-context';

export default {
  title: 'Protocol justification',
  show: props => isProtocolPlaybackMode(props.values, props.standardProtocolsEnabled),
  granted: {
    order: 10
  },
  fields: [
    withProtocolContext(
      {
        name: 'most-appropriate',
        label: 'In what ways have you changed the standard protocol and why?',
        type: 'texteditor'
      },
      {
        standard: {
          type: 'paragraph'
        }
      }
    )
  ]
};

