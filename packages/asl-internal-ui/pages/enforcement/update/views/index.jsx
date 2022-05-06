import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { Header, Snippet, Link } from '@asl/components';
import SubjectRead from './components/subject-read';
import SubjectAdd from './components/subject-add';
import SubjectEdit from './components/subject-edit';

function EnforcementCase() {
  const { enforcementCase, url } = useSelector(state => state.static);
  const [subjects, setSubjects] = useState(enforcementCase.subjects);
  const [addSubjectActive, setAddSubject] = useState(subjects.length === 0);

  const newSubject = Array.isArray(subjects) && subjects.find(s => s.new);
  const showAddButton = !newSubject && !addSubjectActive;

  function toggleEdit(subject) {
    return e => {
      e.preventDefault();

      if (subject.new || subject.deleted) {
        const remainingSubjects = subjects.filter(s => s.id !== subject.id);
        setSubjects(remainingSubjects);
        if (remainingSubjects.length === 0) {
          setAddSubject(true);
        }
      } else {
        subject.editing = !subject.editing;
        setSubjects(subjects.map(s => s.id === subject.id ? subject : s));
      }
    };
  }

  function activateAdd(e) {
    e.preventDefault();
    setAddSubject(true);
  }

  function cancelAdd(e) {
    e.preventDefault();
    if (subjects.length > 0) {
      setAddSubject(false);
    }
  }

  function saveAdd(subject) {
    const opts = {
      method: 'put',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({subject})
    };
    return fetch(`${url}/subject/new-subject`, opts)
      .then(response => response.json())
      .then(subject => {
        if (subject && subject.establishment && subject.profile) {
          // add subject form complete, display edit form instead
          subject.editing = true;
          setSubjects([...subjects, subject]);
          setAddSubject(false);
        }
        return subject;
      });
  }

  return (
    <div className="enforcement-case">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">

          <Header title={<Snippet>page.title</Snippet>} />

          <div className="case-number">
            <p><Snippet number={enforcementCase.caseNumber}>caseNumber.label</Snippet></p>
            {/* <a href="#" className="govuk-link">Edit</a> */}
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
                            ? <SubjectEdit idx={idx} subject={subject} enforcementCase={enforcementCase} toggleEdit={toggleEdit} />
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
                <SubjectAdd idx={subjects.length} save={saveAdd} cancel={cancelAdd} />
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
