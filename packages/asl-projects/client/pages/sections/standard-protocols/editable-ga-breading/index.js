import { gaBreadingData } from '../prefilled-data/ga-breading-data';
import ProtocolFormBase from '../helpers/ga-breading/protocol-form-base';
import { connect } from 'react-redux';
import { ajaxSync, updateProject } from '../../../../actions/projects';

const EditableGABreedingProtocolForm = (props) => (
  <ProtocolFormBase
    {...props}
    title="Add an editable GA breeding protocol"
    radioName="editable-protocols"
    gaBreading={gaBreadingData(false, true)}
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
)(EditableGABreedingProtocolForm);
