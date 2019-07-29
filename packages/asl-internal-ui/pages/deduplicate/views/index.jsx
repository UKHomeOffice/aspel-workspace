import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Header, Search, Snippet } from '@asl/components';
import classnames from 'classnames';

class Index extends React.Component {

  render () {
    const { profile, action, alternates, search } = this.props;
    const dobsDiffer = p => p.dob && profile.dob && p.dob !== profile.dob;

    return <Fragment>
      <Header subtitle={`${profile.firstName} ${profile.lastName}`} title="Merge profile" />
      <p>Merging this profile will transfer all establishment affiliations, licences and roles to another profile.</p>
      <h2>This profile:</h2>
      <table className="govuk-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>DoB</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ profile.firstName } { profile.lastName }</td>
            <td>{ profile.email }</td>
            <td>{ profile.dob || '-' }</td>
          </tr>
        </tbody>
      </table>
      <Search
        key={search}
        action={action}
        filter={search}
        label={<Snippet>fields.search.label</Snippet>}
        hint={<Snippet>fields.search.hint</Snippet>}
        name="search"
        />
      {
        !!alternates.length && (
          <Fragment>
            <h2>Found { alternates.length } possible match{alternates.length > 1 && 'es'}</h2>
            <table className="govuk-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>DoB</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {
                alternates.map(p => (
                  <tr key={p.id}>
                    <td>{ p.firstName } { p.lastName }</td>
                    <td>{ p.email }</td>
                    <td className={classnames({ warning: dobsDiffer(p) })}>{ p.dob || '-' }</td>
                    <td>
                      <form action={action} method="post">
                        <input type="hidden" name="profile" value={p.id} />
                        <button className="govuk-button">Select</button>
                      </form>
                    </td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </Fragment>
        )
      }
    </Fragment>;
  }

}

const mapStateToProps = ({ static: { profile, alternates = [], search, url } }) => ({ profile, alternates, search, action: url });

export default connect(mapStateToProps)(Index);
