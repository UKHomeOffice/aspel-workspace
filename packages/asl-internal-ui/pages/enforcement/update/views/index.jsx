import React from 'react';
import { useSelector } from 'react-redux';
import { Header, Snippet, Link } from '@asl/components';
import EnforcementSubjectRead from './components/enforcement-subject-read';

function EnforcementCase() {
  const { enforcementCase } = useSelector(state => state.static);

  return (
    <div className="enforcement-case">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">

          <Header title={<Snippet>page.title</Snippet>} />

          <div className="case-number">
            <p><Snippet number={enforcementCase.caseNumber}>caseNumber.label</Snippet></p>
            <a href="#" className="govuk-link">Edit</a>
          </div>

          <div className="enforcement-subjects">
            <h2><Snippet>subjects.heading</Snippet></h2>
            {
              enforcementCase.subjects.map((subject, idx) =>
                <EnforcementSubjectRead key={idx} idx={idx} subject={subject} enforcementCase={enforcementCase} />
              )
            }
          </div>

          <p>
            <Link page="enforcement.list" label={<Snippet>action.listCases</Snippet>} />
          </p>

        </div>
      </div>
    </div>
  );
}

export default EnforcementCase;
