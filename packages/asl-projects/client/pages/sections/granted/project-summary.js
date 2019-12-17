import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Review from '../../../components/review';
import RetrospectiveAssessment from '../../../components/retrospective-assessment';
import { formatDate } from '../../../helpers';
import LEGAL from '../../../constants/legal';

import { DATE_FORMAT } from '../../../constants';

const GrantedAuthoritySection = ({ project }) => (
  <div className="granted-section">
    <h2>Granted authority</h2>
    <ReactMarkdown className="legal">{LEGAL.grantedAuthority(project.licenceNumber)}</ReactMarkdown>
  </div>
);

const ProjectSummary = ({
  project,
  values,
  establishment: {
    name,
    licenceNumber,
    address,
    licenceHolder
  },
  fields,
  pdf
}) => {

  return (
    <Fragment>
      {
        !pdf && (
          <Fragment>
            <div className="granted-section">
              <RetrospectiveAssessment />
            </div>
            <div className="granted-section">
              <h2>Project licence number</h2>
              <p>{project.licenceNumber}</p>
            </div>
          </Fragment>
        )
      }
      <div className="granted-section">
        <h2>Project licence holder</h2>
        <p className="licence-holder">{`${project.licenceHolder.firstName} ${project.licenceHolder.lastName}`}</p>
        <ReactMarkdown className="legal">{LEGAL.licenceHolder}</ReactMarkdown>
      </div>
      {
        pdf && (
          <Fragment>
            <GrantedAuthoritySection project={project} />
            <div className="granted-section">
              <RetrospectiveAssessment />
            </div>
          </Fragment>
        )
      }
      {
        !pdf && (
          <Fragment>
            <div className="granted-section">
              <Review
                {...fields.find(f => f.name === 'duration')}
                value={values.duration}
                noComments
              />
            </div>
            <div className="granted-section">
              <h3>Date granted</h3>
              <p>{formatDate(project.issueDate, DATE_FORMAT.long)}</p>
            </div>
            <div className="granted-section">
              <h3>Expiry date</h3>
              <p>{formatDate(project.expiryDate, DATE_FORMAT.long)}</p>
            </div>
          </Fragment>
        )
      }
      <div className="granted-section">
        <h2>Project location</h2>
        <p className="legal">You are authorised to undertake this programme of scientific procedures at the following places:</p>
        <div className="granted-section">
          <h3>Primary establishment</h3>
          <p>{ name }</p>
          <dl className="inline">
            <dt>Establishment licence number: </dt>
            <dd>{ licenceNumber }</dd>
            <dt>Establishment licence holder: </dt>
            <dd>{ licenceHolder ? `${licenceHolder.firstName} ${licenceHolder.lastName}` : '-' }</dd>
            <dt>Address: </dt>
            <dd>{ address }</dd>
          </dl>
        </div>
        {
          values.establishments && !!values.establishments.length && (
            <div className="granted-section">
              <h3>Additional establishments</h3>
              <ul>
                {
                  values.establishments.map((e, i) => <li key={i}><strong>{e['establishment-name']}</strong></li>)
                }
              </ul>
            </div>
          )
        }
        {
          values.polesList && !!values.polesList.length && (
            <div className="granted-section">
              <h3>Places other than a licensed establishment (POLEs):</h3>
              <ul>
                {
                  values.polesList.map((p, i) => (
                    <li key={i}>
                      <strong>{p.title}</strong><br />
                      <Review
                        type="texteditor"
                        value={p['pole-info']}
                      />
                    </li>
                  ))
                }
              </ul>
            </div>
          )
        }
      </div>
      {
        !pdf && <GrantedAuthoritySection project={project} />
      }
    </Fragment>
  );
}

export default connect(({
  project: values,
  application: { project, establishment }
}) => ({
  values,
  project,
  establishment
}))(ProjectSummary);
