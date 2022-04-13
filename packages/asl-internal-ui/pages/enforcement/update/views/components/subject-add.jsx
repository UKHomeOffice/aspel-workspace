import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Snippet } from '@asl/components';
import EstablishmentSelect from './establishment-select';
import ProfileSelect from './profile-select';

function EnforcementSubjectAdd({ idx, save }) {
  const sessionSubject = useSelector(state => state.static.sessionSubject);
  const [subject, setSubject] = useState(sessionSubject || { new: true });
  const isOnlySubject = idx === 0;

  function formSubmit(e) {
    e.preventDefault();
    save(subject).then(subject => {
      // prevent state update on unmounted component once we switch to edit mode
      if (!subject.editing) {
        setSubject(subject);
      }
    });
  }

  function handleEstablishmentChange(establishmentId) {
    setSubject({ ...subject, establishmentId });
  }

  function handleProfileChange(profileId) {
    setSubject({ ...subject, profileId });
  }

  function cancelAdd(e) {
    save({}).then(subject => setSubject(subject));
  }

  useEffect(() => {
    console.log(subject);
  }, [subject]);

  return (
    <div className="enforcement-subject">
      <h3><Snippet idx={idx + 1}>subjects.repeaterHeading</Snippet></h3>

      <form className="enforcement-subject-add" onSubmit={formSubmit}>
        <Fragment>
          {
            !subject.establishment &&
              <label className="govuk-label" htmlFor="establishment">
                <span>Select establishment</span>
                <EstablishmentSelect name="establishmentId" onChange={handleEstablishmentChange} />
              </label>
          }

          {
            subject.establishment &&
              <Fragment>
                <dl className="inline wide">
                  <dt>Establishment</dt>
                  <dd><span>{subject.establishment.name}</span> <a href="#" onClick={cancelAdd}>Edit</a></dd>
                </dl>
                <label className="govuk-label" htmlFor="profile">
                  <span>Select person</span>
                  <ProfileSelect name="profile" onChange={handleProfileChange} />
                </label>
              </Fragment>
          }

          <p className="control-panel">
            <button type="submit" className="govuk-button">
              <Snippet>{`buttons.add.${subject.establishment ? 'profile' : 'establishment'}`}</Snippet>
            </button>
            {
              !isOnlySubject && <a href="#" onClick={cancelAdd}><Snippet>buttons.cancel</Snippet></a>
            }
          </p>
        </Fragment>
      </form>
    </div>
  );
}

export default EnforcementSubjectAdd;
