import React, { Fragment, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { Button } from '@ukhomeoffice/react-components';
import { compareTrainingRecords } from '../../helpers/trainingRecordsComparison';
import { trainingRecordHolder } from '../../helpers/training-record-holder.mjs';
import TrainingSummaryWithChangeHighlighting from '../../components/training-summary-custom';
import Fieldset from '../../components/fieldset';
import ReviewFields from '../../components/review-fields';
export default function Training(props) {
  const { training, basename, readonly, canUpdateTraining, licenceHolder } = useSelector(state => state.application, shallowEqual);
  const projectStatus = useSelector(state => state.application.project?.status);
  const holder = trainingRecordHolder(licenceHolder, projectStatus);
  const project = useSelector(state => state.project);
  const form = useRef(null);
  const history = useHistory();
  const trainingComplete = project['training-complete'];
  const fields = props.fields.map(f => {
    return f.name === 'training-complete' ? { ...f, type: 'comments-only' } : f;
  });
  const trainingHistory = useSelector(state => state.static.previousTraining);

  const comparisons = useMemo(
    () => compareTrainingRecords(
      project.training,
      trainingHistory
    ),
    [project.training, trainingHistory]
  );

  function onSubmit(e) {
    e.preventDefault();
    if (trainingComplete) {
      return history.push('/');
    }
    form.current.submit();
  }

  const RecordHeader = ({ children }) => {
    return readonly ? <h3 className="govuk-heading-m">{children}</h3> : <h2 className="govuk-heading-m">{children}</h2>;
  }

  return (
    <Fragment>
      {readonly
        ? <h2>Training record</h2>
        : <><h1>Training</h1><p>{props.intro}</p></>
      }
      <div className='heading-wrapper'>
        {holder && <span className="govuk-caption-m">{holder.status}</span>}
        <RecordHeader>{holder ? `${holder.name}'s training record` : 'Training record'}</RecordHeader>
      </div>
      <TrainingSummaryWithChangeHighlighting
        certificates={readonly ? project.training : training}
        comparisons={comparisons}
        project={project}
        readonly={readonly}
      />

      {(readonly || !canUpdateTraining)
        ? <ReviewFields {...props} fields={fields} showTitle={false}/>
        : (
          <form
            ref={form}
            action={`${basename}/update-training`}
            onSubmit={onSubmit}
            method="POST"
          >
            <Fieldset {...props} onFieldChange={props.save} />
            <Button>Continue</Button>
          </form>
        )}
    </Fragment>
  );
}
