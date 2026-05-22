export default {
  title: 'Protocol justification',
  label: 'In what ways have you changed the standard protocol and why?',
  type: 'texteditor',
  show: props => props.values?.isStandardProtocol === true
};

