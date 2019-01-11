import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Header } from '@asl/components';

import ASRUAdmin from '../components/asru-admin';

class Index extends React.Component {

  render () {

    const model = this.props.model;
    const hasEstablishments = !!model.establishments.length;
    return <Fragment>
      <Header title={`${model.firstName} ${model.lastName}`} />
      <dl>
        <dt>Email:</dt>
        <dd><a href={`mailto:${model.email}`}>{ model.email }</a></dd>
      </dl>

      { hasEstablishments ? null : <ASRUAdmin /> }

    </Fragment>
  }

}

const mapStateToProps = ({ model }) => ({ model });

export default connect(mapStateToProps)(Index);
