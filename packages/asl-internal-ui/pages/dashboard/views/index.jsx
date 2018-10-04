import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import DataTable from '@asl/pages/pages/common/views/containers/datatable';

const mapStateToProps = state => {
  return {
    profile: state.static.profile
  };
};

const formatters = {
  created_at: {
    format: value => moment(value).format('D MMMM YYYY HH:mm')
  },
  type: {
    format: data => `${data.action} ${data.model}`
  },
  id: {
    format: (id, obj) => {
      if (obj.status === 'resolved') {
        return null;
      }
      return <form method="post" action={`/task/${id}`}><input type="submit" value="approve" className="govuk-button" /></form>
    }
  }
}

class Dashboard extends React.Component {

  render() {
    return <div className="js-enabled">
      <h1>Hello { this.props.profile.firstName }</h1>
      <DataTable formatters={formatters} />
    </div>
  }

}

export default connect(mapStateToProps)(Dashboard);
