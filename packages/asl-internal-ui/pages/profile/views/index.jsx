import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Header } from '@asl/components';

const Index = ({ model }) => (
  <Fragment>
    <Header title={`${model.firstName} ${model.lastName}`} />
  </Fragment>
);

const mapStateToProps = ({ model }) => ({ model });

export default connect(mapStateToProps)(Index);
