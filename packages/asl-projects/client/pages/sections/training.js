import React, { Fragment, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { TrainingSummary } from '@ukhomeoffice/asl-components';
import { Button } from '@ukhomeoffice/react-components';
import TrainingSummaryCustom from '../../components/training-summary-custom';
import Fieldset from '../../components/fieldset';
import ReviewFields from '../../components/review-fields';
import ChangedBadge from '../../components/changed-badge';

export default function Training(props) {
  const { training, basename, readonly, canUpdateTraining } = useSelector(state => state.application, shallowEqual);
  const project = useSelector(state => state.project);
  const form = useRef(null);
  const history = useHistory();
  const trainingComplete = project['training-complete'];

  const fields = props.fields.map(f => {
    return f.name === 'training-complete' ? { ...f, type: 'comments-only' } : f;
  });

  function compareTrainingRecords(current = [], trainingHistory = []) {
    const results = { added: [], removed: [], changed: [] };

    if (!Array.isArray(trainingHistory) || trainingHistory.length < 2) return results;

    // Identify reference versions based on version number
    const currentVersion = trainingHistory.find(v => v.version === 1) || trainingHistory[0];
    const previousVersion = trainingHistory.find(v => v.version === 2) || trainingHistory[1];
    const firstVersion = trainingHistory[trainingHistory.length - 1];

    const currentRecords = currentVersion.trainingRecords || [];
    const prevRecords = previousVersion.trainingRecords || [];
    const firstRecords = firstVersion.trainingRecords || [];

    const getIds = arr => arr.map(r => r.trainingId);
    const currentIds = getIds(currentRecords);
    const prevIds = getIds(prevRecords);
    const firstIds = getIds(firstRecords);

    // Added / Removed
    const addedPink = currentIds.filter(id => !prevIds.includes(id));
    const addedGray = currentIds.filter(id => !firstIds.includes(id));
    const removedPink = prevIds.filter(id => !currentIds.includes(id));
    const removedGray = firstIds.filter(id => !currentIds.includes(id));

    results.added.push({ color: "pink", ids: addedPink });
    results.added.push({ color: "gray", ids: addedGray });
    results.removed.push({ color: "pink", ids: removedPink });
    results.removed.push({ color: "gray", ids: removedGray });

    // Detect field-level changes
    const findById = (arr, id) => arr.find(r => r.trainingId === id);

    const detectChanges = (cur, old) => {
      if (!old) return null;
      const diff = {};
      for (const key in cur) {
        if (key === "trainingId") continue;
        const a = cur[key];
        const b = old[key];
        if (Array.isArray(a) && Array.isArray(b)) {
          const added = a.filter(x => !b.includes(x));
          const removed = b.filter(x => !a.includes(x));
          if (added.length || removed.length) diff[key] = { added, removed };
        } else if (a !== b) {
          diff[key] = { old: b, new: a };
        }
      }
      return Object.keys(diff).length ? diff : null;
    };

    const changedPink = [], changedPinkDetails = {};
    const changedGray = [], changedGrayDetails = {};

    currentRecords.forEach(cur => {
      const prev = findById(prevRecords, cur.trainingId);
      const first = findById(firstRecords, cur.trainingId);

      const diffPink = detectChanges(cur, prev);
      const diffGray = detectChanges(cur, first);

      if (diffPink) {
        changedPink.push(cur.trainingId);
        changedPinkDetails[cur.trainingId] = diffPink;
      }
      if (diffGray) {
        changedGray.push(cur.trainingId);
        changedGrayDetails[cur.trainingId] = diffGray;
      }
    });

    results.changed.push({ color: "pink", ids: changedPink, details: changedPinkDetails });
    results.changed.push({ color: "gray", ids: changedGray, details: changedGrayDetails });

    return results;
  }





  const comparisons = compareTrainingRecords(
    project.training, // version 0
    project.trainingHistory // array of { version, trainingRecords }
  );

  console.log(JSON.stringify(comparisons, null, 2));


  function onSubmit(e) {
    e.preventDefault();
    if (trainingComplete) {
      return history.push('/');
    }
    form.current.submit();
  }

  // 🧩 Render
  return (
    <Fragment>
      {!readonly && <h1>Training</h1>}
      <p>{props.intro}</p>

      <h2>Training records</h2>
      <ChangedBadge fields={['training']} />

      {/* Default ASL summary */}
      <TrainingSummary certificates={readonly ? project.training : training} />

      {/* Custom summary with highlights */}
      <TrainingSummaryCustom
        certificates={readonly ? project.training : training}
        comparisons={comparisons}
        project={project}
        readonly={readonly}
      />

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
