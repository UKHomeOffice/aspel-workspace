import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Header, Link, Search, Snippet } from '@asl/components';
import Tasklist from '@asl/pages/pages/task/list/views/tasklist';

const models = [
  'establishments',
  'people',
  'projects'
];

const Index = ({ profile, searchType }) => (
  <Fragment>
    <Header title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>} />

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <div className="search-panel">
          <h2><Snippet>searchPanel.title</Snippet></h2>

          <ul className="search-type">
            { models.map((model, index) => (
              <li key={index}>
                <a href={`/?searchType=${model}`} className={searchType === model ? 'active' : ''}>
                  <Snippet>{`searchPanel.${model}.label`}</Snippet>
                </a>
              </li>
            )) }
          </ul>

          <div className="govuk-grid-row">

            <div className="govuk-grid-column-two-thirds">
              <Search />
            </div>

            <div className="govuk-grid-column-one-third">
              <div className="view-all-link">
                { searchType === 'establishments' &&
                  <Link
                    page="establishment.list"
                    label={<Snippet>searchPanel.establishments.viewAll</Snippet>}
                  />
                }
                { searchType === 'people' &&
                  <Link
                    page="profile.list"
                    label={<Snippet>searchPanel.people.viewAll</Snippet>}
                  />
                }
                { searchType === 'projects' &&
                  <Link
                    page="project.list"
                    label={<Snippet>searchPanel.projects.viewAll</Snippet>}
                  />
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h2><Snippet>pages.dashboard.tasks</Snippet></h2>
        <Tasklist />
      </div>
    </div>
  </Fragment>
);

const mapStateToProps = ({
  static: { profile, searchType }
}) => ({ profile, searchType });

export default connect(mapStateToProps)(Index);
