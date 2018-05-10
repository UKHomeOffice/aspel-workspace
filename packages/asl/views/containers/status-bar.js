import { connect } from 'react-redux';
import StatusBar from '../components/status-bar';

const mapStateToProps = state => ({
  name: state.user.split(' ')[0]
});

export default connect(
  mapStateToProps
)(StatusBar);
