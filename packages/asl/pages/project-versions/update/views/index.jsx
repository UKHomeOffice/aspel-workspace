import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { LicenceStatusBanner } from '@asl/components';

const Project = ({ project }) => {
  return (<Fragment>
    <LicenceStatusBanner licence={project} licenceType="ppl" />
    <div id="ppl-drafting-tool"></div>
  </Fragment>
  );
};

const mapStateToProps = ({ static: { project } }) => ({ project });

export default connect(mapStateToProps)(Project);
