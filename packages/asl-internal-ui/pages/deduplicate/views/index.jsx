import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import get from 'lodash/get';
import { Header, Search, Snippet, Link } from '@asl/components';

const dobsDiffer = (profile1, profile2) => profile1.dob && profile2.dob && profile1.dob !== profile2.dob;
const bothActivePils = (profile1, profile2) => get(profile1, 'pil.status') === 'active' && get(profile2, 'pil.status') === 'active';

class Index extends React.Component {

  onSubmit(p, e) {
    e.preventDefault();
    if (bothActivePils(p, this.props.profile)) {
      return window.alert('These profiles cannot be merged as both have active PILs');
    }
    if (dobsDiffer(p, this.props.profile)) {
      if (window.confirm('These profiles have different dates of birth, are you sure you want to continue?')) {
        return e.target.submit();
      }
    }
    if (window.confirm('This action cannot be undone')) {
      e.target.submit();
    }
  }

  render () {
    const { profile, action, alternates, search } = this.props;

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
                      <td className={classnames({ warning: dobsDiffer(p, profile) })}>{ p.dob || '-' }</td>
                      <td>
                        <form action={action} method="post" onSubmit={this.onSubmit.bind(this, p)}>
                          <input type="hidden" name="profile" value={p.id} />
                          <button className="govuk-button float-right">Select</button>
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
      <p>
        <Link page="globalProfile" label={<Snippet>actions.back</Snippet>} />
      </p>
    </Fragment>;
  }

}

const mapStateToProps = ({ static: { profile, alternates = [], search, url } }) => ({ profile, alternates, search, action: url });

export default connect(mapStateToProps)(Index);
