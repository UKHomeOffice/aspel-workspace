import ProtocolFormBase from '../helpers/ga-breading/protocol-form-base';
import { gaBreadingData } from '../prefilled-data/ga-breading-data';
import { connect } from 'react-redux';
import { ajaxSync, updateProject } from '../../../../actions/projects';

const GABreedingProtocolForm = (props) => (
  <ProtocolFormBase
    {...props}
    title="Add a standard GA breeding protocol"
    radioName="standard-protocols"
    gaBreading={gaBreadingData(true, false)}
    cancelPath="/standard-protocol"
  />
);

const mapStateToProps = (state) => ({
  project: state.project
});

const mapDispatchToProps = {
  updateProjectAction: updateProject,
  ajaxSyncAction: ajaxSync
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GABreedingProtocolForm);
