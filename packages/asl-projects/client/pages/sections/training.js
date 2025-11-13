import React, { Fragment, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { TrainingSummary } from '@ukhomeoffice/asl-components';
import { Button } from '@ukhomeoffice/react-components';
import { compareTrainingRecords } from '../../helpers/trainingRecordsComparison';
import TrainingSummaryWithChangeHighlighting from '../../components/training-summary-custom';
import Fieldset from '../../components/fieldset';
import ReviewFields from '../../components/review-fields';
import ChangedBadge from '../../components/changed-badge';
const { FEATURE_FLAG_TRAINING_RECORD } = require('@asl/service/ui/feature-flag');
export default function Training(props) {
  const { training, basename, readonly, canUpdateTraining } = useSelector(state => state.application, shallowEqual);
  const project = useSelector(state => state.project);
  const form = useRef(null);
  const history = useHistory();
  const trainingComplete = project['training-complete'];
  const trainingRecordHighlight = useFeatureFlag(FEATURE_FLAG_TRAINING_RECORD);
  const fields = props.fields.map(f => {
    return f.name === 'training-complete' ? { ...f, type: 'comments-only' } : f;
  });

  const comparisons = useMemo(
    () => compareTrainingRecords(
      project.training,
      project.trainingHistory
    ),
    [project.training, project.trainingHistory]
  );

console.log(project.training);
console.log(project.trainingHistory);

  function onSubmit(e) {
    e.preventDefault();
    if (trainingComplete) {
      return history.push('/');
    }
    form.current.submit();
  }

  // Render
  return (
    <Fragment>
      {!readonly && <h1>Training</h1>}
      <p>{props.intro}</p>

      <h2>Training records</h2>
      <ChangedBadge fields={['training']} />
      {
        /* feature flag enabled  */
        trainingRecordHighlight ? (
          <TrainingSummaryWithChangeHighlighting
            certificates={readonly ? project.training : training}
            comparisons={comparisons}
            project={project}
            readonly={readonly}
          />
        ) : (
          <TrainingSummary certificates={readonly ? project.training : training} />
        )
      }

      {(readonly || !canUpdateTraining)
        ? <ReviewFields {...props} fields={fields} />
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
