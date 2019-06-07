import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { LicenceStatusBanner } from '@asl/components';

const Project = ({ project, version }) => {
  return (<Fragment>
    <LicenceStatusBanner licence={project} version={version} licenceType="ppl" />
    <div id="ppl-drafting-tool"></div>
  </Fragment>
  );
};

const mapStateToProps = ({ static: { project, version } }) => ({ project, version });

export default connect(mapStateToProps)(Project);
