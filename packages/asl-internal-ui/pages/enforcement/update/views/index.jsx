import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Header, Snippet, Link } from '@asl/components';
import SubjectRead from './components/subject-read';
import SubjectAdd from './components/subject-add';
import SubjectEdit from './components/subject-edit';

function EnforcementCase() {
  const { enforcementCase, url } = useSelector(state => state.static);
  const [subjects, setSubjects] = useState(enforcementCase.subjects);
  const [addSubjectActive, setAddSubject] = useState(subjects.length === 0);

  const newSubject = Array.isArray(subjects) && subjects.find(s => s.id === 'new-subject');
  const showAddButton = !newSubject && !addSubjectActive;

  function toggleEdit(subjectId) {
    return e => {
      e.preventDefault();
      const subject = subjects.find(s => s.id === subjectId);
      subject.editing = !subject.editing;
      setSubjects([...subjects]);
    };
  }

  useEffect(() => {
  }, [subjects]);

  function saveEdit(e) {
    e.preventDefault();
  }

  function activateAdd(e) {
    e.preventDefault();
    setAddSubject(true);
  }

  function saveAdd(subject) {
    const opts = {
      method: 'put',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({subject})
    };
    return fetch(`${url}/subject/${subject.id}`, opts).then(response => response.json());
  }

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
              subjects.length > 0 &&
                <Fragment>
                  {
                    subjects.map((subject, idx) =>
                      <Fragment key={subject.id}>
                        {
                          subject.editing
                            ? <SubjectEdit idx={idx} subject={subject} enforcementCase={enforcementCase} toggleEdit={toggleEdit} save={saveEdit} />
                            : <SubjectRead idx={idx} subject={subject} enforcementCase={enforcementCase} toggleEdit={toggleEdit} />
                        }
                      </Fragment>
                    )
                  }
                  {
                    showAddButton &&
                      <a href="#" className="govuk-button" onClick={activateAdd}>
                        <Snippet>action.addSubject</Snippet>
                      </a>
                  }
                </Fragment>
            }

            {
              addSubjectActive &&
                <SubjectAdd idx={subjects.length} save={saveAdd} />
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
