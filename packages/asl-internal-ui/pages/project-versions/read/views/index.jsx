import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from '@asl/components';

const Project = ({ establishmentId, projectId, versionId }) => (
  <Fragment>
    <div id="ppl-drafting-tool"></div>
    <Link
      className="govuk-button"
      page="project.task"
      establishmentId={establishmentId}
      projectId={projectId}
      versionId={versionId}
      label="Next steps"
    />
  </Fragment>
);

const mapStateToProps = ({ static: { establishmentId, projectId, versionId } }) => ({ establishmentId, projectId, versionId });

export default connect(mapStateToProps)(Project);
