const React = require('react');
const { connect } = require('react-redux');

const mapStateToProps = state => {
  return {pdf: state.pdf}
};

const ScreenOnly = (Primary, Fallback) => {

  const EmptyComponent = () => <React.Fragment/>;
  Fallback = Fallback || EmptyComponent;

  const Component = props => {
    return props.pdf ? <Fallback { ...props } /> : <Primary { ...props } />;
  }

  return connect(
    mapStateToProps
  )(Component);

};

module.exports = ScreenOnly;
