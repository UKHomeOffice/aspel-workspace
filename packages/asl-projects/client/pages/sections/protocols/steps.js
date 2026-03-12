import React, { Component, createRef, Fragment, useState } from 'react';
import { useParams } from 'react-router';

import classnames from 'classnames';
import { Button, Warning } from '@ukhomeoffice/react-components';

import isUndefined from 'lodash/isUndefined';
import { flatMap, pickBy, uniqBy } from 'lodash';

import ReviewFields from '../../../components/review-fields';
import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import NewComments from '../../../components/new-comments';
import StepBadge from '../../../components/step-badge';
import { v4 as uuid } from 'uuid';
import Review from '../../../components/review';
import {
  getRepeatedFromProtocolIndex,
  getStepTitle,
  getTruncatedStepTitle,
  hydrateSteps,
  removeNewDeleted,
  addDeletedReusableSteps
} from '../../../helpers/steps';
import { saveReusableSteps } from '../../../actions/projects';
import Expandable from '../../../components/expandable';
import cloneDeep from 'lodash/cloneDeep';

function isNewStep(step) {
  // A step is considered the "new placeholder" if it only contains an id (and any
  // small set of ignored metadata keys) or if it explicitly has the addExisting flag.
  // We must ignore any protocol-level flags and other metadata (e.g. isStandardProtocol,
  // standardProtocolType, saved, completed, reusable metadata) so that decorating steps
  // does not break the placeholder detection.
  if (!step) {
    return false;
  }

  const IGNORED_KEYS = new Set([
    'addExisting',
    'isStandardProtocol',
    'standardProtocolType',
    'saved',
    'completed',
    'reusable',
    'reusableStepId',
    'existingValues',
    'reference',
    'reusedStep'
  ]);

  const keys = Object.keys(step).filter(k => !IGNORED_KEYS.has(k));
  // If the only non-ignored key is 'id' it's a new placeholder
  if (keys.length === 1 && keys[0] === 'id') {
    return true;
  }

  // Backwards compatible: if addExisting is defined treat as placeholder
  return !isUndefined(step.addExisting);
}

function renderUsedInProtocols(protocolIndexes) {
  if (protocolIndexes.length < 2) {
    return protocolIndexes;
  }
  return `${protocolIndexes.slice(0, protocolIndexes.length - 1).join(',')} and ${protocolIndexes[protocolIndexes.length - 1]}`;
}

class Step extends Component {
  constructor(options) {
    super(options);
    this.step = createRef();
  }

  removeItem = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to remove this step?')) {
      if (!this.props.values.completed) {
        await this.setCompleted(true);
      }
      this.props.updateReusable(false);
      this.props.removeItem();
    }
  }

  scrollToPrevious = () => {
    const index = this.props.index ? this.props.index - 1 : 0;
    const step = document.querySelectorAll('.steps .step')[index];
    window.scrollTo({
      top: step.offsetTop,
      left: 0
    });
  }

  scrollToStep = () => {
    window.scrollTo({
      top: this.step.current.offsetTop,
      left: 0
    });
  }

  saveStep = e => {
    e.preventDefault();
    this.props.updateItem({ completed: true, existingValues: undefined, addExisting: undefined });
    this.scrollToStep();
  }

  editStep = e => {
    e.preventDefault();
    this.setCompleted(false);
    this.scrollToStep();
  }

  editThisStep = e => {
    const editFlagApplied = this.props.values.reference && this.props.values.reference.slice(-8) === '(edited)';
    const newReference = editFlagApplied ? this.props.values.reference : `${this.props.values.reference} (edited)`;
    e.preventDefault();
    this.props.updateItem({ completed: false, reference: this.props.values.reference ? newReference : null, reusableStepId: uuid(), saved: false, existingValues: cloneDeep(this.props.values) });
    this.scrollToStep();
  }

  editReusableStep = e => {
    e.preventDefault();
    this.props.updateItem({ completed: false, existingValues: cloneDeep(this.props.values) });
    this.scrollToStep();
  }

  cancelItem = e => {
    e.preventDefault();
    this.props.updateItem({ ...(cloneDeep(this.props.values.existingValues)), existingValues: undefined, completed: true });
    this.scrollToStep();
  }

  setCompleted = completed => {
    this.props.updateItem({ completed });
  }

  moveUp = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.updateReusable(false);
    this.props.moveUp();
  }

  moveDown = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.updateReusable(false);
    this.props.moveDown();
  }

  isOldStep = previousSteps => {
    let stepIds = [];
    previousSteps.forEach(protocol => {
      protocol.forEach(step => stepIds.push(step.id));
    });
    return stepIds.includes(this.props.values.id);
  }

  componentDidMount() {
    if (this.props.protocolState && !isUndefined(this.props.protocolState.sectionItem)) {
      const activeStep = this.props.protocolState.sectionItem;
      if (activeStep === this.props.values.id) {
        this.props.updateItem({ completed: false });
      }
    }
  }

  render() {
    const {
      index,
      fields,
      values,
      updateItem,
      parentUpdateItem,
      length,
      editable,
      deleted,
      isReviewStep,
      protocol,
      newComments,
      reusableSteps,
      pdf,
      readonly,
      expanded,
      onToggleExpanded,
      number,
      prefix
    } = this.props;

    const re = new RegExp(`^(reusable)?S?s?teps.${values.id}\\.`);

    const relevantComments = Object.values(
      pickBy(newComments, (value, key) => key.match(re))
    ).reduce((total, comments) => total + (comments || []).length, 0);

    const completed = !editable || values.completed;
    const editingReusableStep = !completed && values.existingValues && values.reusableStepId && values.saved;
    const stepEditable = editingReusableStep ? (values.existingValues.id === values.id) : !completed;
    const commentPrefix = values.reusableStepId ? `reusableSteps.${values.reusableStepId}.` : undefined;

    const stepContent = <>{
      !stepEditable && values.title && (
        <ReviewFields
          fields={[fields.find(f => f.name === 'title')]}
          values={values}
          prefix={prefix}
          editLink={`0#${this.props.prefix}`}
          protocolId={protocol.id}
          stepId={values.id}
          readonly={!isReviewStep}
          commentPrefix={commentPrefix}
        />
      )
    }
    {
      stepEditable && !deleted
        ? <Fragment>
          {!editingReusableStep ? <Fieldset
            fields={fields}
            prefix={prefix}
            onFieldChange={(key, value) => updateItem({ [key]: value })}
            commentPrefix={commentPrefix}
            values={values}
          /> : <Fragment>
            <Fieldset
              fields={fields.filter(f => f.name !== 'reusable')}
              prefix={prefix}
              commentPrefix={commentPrefix}
              onFieldChange={(key, value) => updateItem({ [key]: value })}
              values={values}
            />
            <Review
              {...fields.find(f => f.name === 'reusable')}
              value={values.existingValues.reusable}
              readonly={true}
              className="reusable"
              commentKey={commentPrefix ? `${commentPrefix}reusable` : undefined}
            />
            <Warning>You cannot change this answer when editing reusable steps.</Warning>
          </Fragment>
          }
          <p className="control-panel">
            <Button onClick={this.saveStep}>Save step</Button>
            {
              length > 1 && <Button className="link" onClick={this.removeItem}>{editingReusableStep ? 'Remove this step from this protocol' : 'Remove step'}</Button>
            }
            {
              values.existingValues && <Button className="link" onClick={this.cancelItem}>Cancel</Button>
            }
          </p>
        </Fragment>
        : <div className="review">
          <ReviewFields
            fields={fields.filter(f => f.name !== 'title')}
            values={values}
            prefix={prefix}
            commentPrefix={commentPrefix}
            editLink={`0#${this.props.prefix}`}
            readonly={!isReviewStep}
            protocolId={protocol.id}
            stepId={values.id}
          />
          {
            values.isStandardProtocol ? null : !values.reusable && editable && !deleted && <a href="#" onClick={this.editStep}>Edit step</a>
          }
          {
            values.reusable && editable && !deleted && (
              <a href="#" onClick={this.editReusableStep}>Edit every instance of this reusable step</a>
            )
          }
        </div>
    }</>;

    const repeatedFrom = getRepeatedFromProtocolIndex(values, protocol.id);

    const canReorder =
      !values.isStandardProtocol &&
      editable &&
      completed &&
      !deleted &&
      !values.deleted;

    const isMandatory =
      values?.optional === false &&
      ['standard', 'editable'].includes(values?.standardProtocolType);

    const step = <>
      {
        values.deleted && <span className="badge deleted">removed</span>
      }
      <section
        className={classnames('step', { completed: !stepEditable, editable })}
        ref={this.step}
      >
        <NewComments comments={relevantComments} />
        {
          !values.deleted && <StepBadge fields={values} changeFieldPrefix={prefix} protocolId={protocol.id} position={index}/>
        }
        <Fragment>
          {
            canReorder && (
              <div className="float-right">
                {
                  length > 1 && (
                    <span>
                      Reorder:{' '}
                      {index === 0
                        ? <span className="disabled">Up</span>
                        : <a href="#" onClick={(e) => { e.preventDefault(); this.moveUp(e); }}>Up</a>
                      }
                      {' '}
                      {index + 1 >= length
                        ? <span className="disabled">Down</span>
                        : <a href="#" onClick={(e) => { e.preventDefault(); this.moveDown(e); }}>Down</a>
                      }
                    </span>
                  )
                }
                {!isMandatory  && length > 1 && (
                  <span> | <a href="#" onClick={this.removeItem}>Remove</a></span>
                )}
              </div>
            )
          }
          <h3>
            Step {!values.deleted && `${number + 1}: ${values.reference ? ` ${values.reference}` : ''}`}

            <a href="#" className={classnames('inline-block', { restore: values.deleted })} onClick={this.props.restoreItem}>{values.deleted ? ' Restore' : ''}</a>

            {(pdf || readonly) && values.reference && (
              <Fragment>: {values.reference}</Fragment>)}
            {
              completed && !isUndefined(values.optional) &&
              <span className="light smaller">{` (${isMandatory ? 'mandatory': 'optional'})`}</span>
            }
            {
              !pdf && readonly && repeatedFrom && (<div className="light smaller">{`Repeated from protocol ${repeatedFrom}`}</div>)
            }
          </h3>
          {
            pdf && repeatedFrom && <span className="review"><p className="grey">{`Repeated from protocol ${repeatedFrom}`}</p></span>
          }
        </Fragment>
        <EditStepWarning editingReusableStep={editingReusableStep} protocol={protocol} step={values} completed={completed}/>
        {!values.deleted && stepContent}
      </section>
    </>;

    if (editable && isNewStep(values)) {
      const onSaveSelection = (selectedSteps) => {
        // Replace current step with selected
        const mappedSteps = flatMap(this.props.protocol.steps || [], step => {
          if (step.id === values.id) {
            return selectedSteps.map(selectedStep => {
              return { id: uuid(), reusableStepId: selectedStep };
            });
          }
          return [step];
        });
        parentUpdateItem({ steps: mappedSteps });
      };

      const fields = [{
        name: 'addExisting',
        label: 'Add step',
        type: 'radio',
        className: 'smaller',
        options: [
          {
            label: 'Create a new step',
            value: false,
            reveal: {
              component: step
            }
          },
          {
            label: 'Select steps used in other protocols',
            value: true,
            reveal: {
              component: <StepSelector reusableSteps={reusableSteps} values={values} onSaveSelection={onSaveSelection} onCancel={this.removeItem} length={length} />
            }
          }
        ],
        inline: false
      }];

      return (<Fragment>
        <Fieldset
          fields={fields}
          prefix={`${values.id}-add-step`}
          onFieldChange={(key, value) => {
            this.props.updateReusable(false);
            updateItem({ [key]: value });
          }}
          values={values}
        />
      </Fragment>);
    }

    if (isReviewStep || readonly) {
      return (
        <section className={'review-step'}>
          <NewComments comments={relevantComments} />
          {
            values.deleted && <span className="badge deleted">removed</span>
          }
          {
            !values.deleted && !pdf && <StepBadge fields={values} changeFieldPrefix={prefix} protocolId={protocol.id} position={index} />
          }
          <Expandable expanded={expanded} onHeaderClick={() => onToggleExpanded(index)}>
            <Fragment>
              <p className={'toggles float-right'}>
                <Button className="link no-wrap" onClick={() => onToggleExpanded(index)}>{expanded ? 'Close' : 'Open'} step</Button>
              </p>
              {values.reference ? <h3 className={'title inline'}>{values.reference}</h3> : <h3 className={'title no-wrap'}>{getStepTitle(values.title)}</h3>}
              <h4
                className="light">{values.deleted ? 'Removed step' : `Step ${number + 1}`} {values.optional === true ? '(optional)' : '(mandatory)'}{repeatedFrom ? ` - repeated from protocol ${repeatedFrom}` : ''}</h4>
            </Fragment>
            {stepContent}
          </Expandable>
        </section>
      );
    }
    return step;
  }
}

const StepSelector = ({reusableSteps, values, onSaveSelection, length, onCancel}) => {
  const DEFAULT_STEP_REFERENCE = 'Unnamed step';
  const MAX_CHARACTERS_FROM_TITLE = 80;
  const [selectedSteps, setSelectedSteps] = useState([]);
  const references = {};
  const options = uniqBy(reusableSteps, 'id')
    .map(reusableStep => {
      const reference = reusableStep.reference || getTruncatedStepTitle(reusableStep, MAX_CHARACTERS_FROM_TITLE) || DEFAULT_STEP_REFERENCE;
      const referenceCount = references[reference] || 0;
      references[reference] = referenceCount + 1;
      return {
        label: reference + (referenceCount > 0 ? ' ' + referenceCount : ''),
        value: reusableStep.id
      };
    })
    .sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

  const selectStepFields = [{
    name: 'select-steps',
    label: 'Select step',
    type: 'checkbox',
    className: 'smaller',
    options: options
  }];
  const saveSelectionHandler = () => {
    onSaveSelection(selectedSteps);
  };

  return <Fragment>
    <Fieldset
      fields={selectStepFields}
      prefix={`${values.id}-select-steps`}
      onFieldChange={(key, value) => {
        setSelectedSteps(value);
      }}
      values={values}
    />
    <p className="control-panel">
      <Button className={classnames('block', 'save-selection')} onClick={saveSelectionHandler}>Add steps to protocol</Button>
      {
        length > 1 && <Button className="link" onClick={onCancel}>Cancel</Button>
      }
    </p>
  </Fragment>;
};

const EditStepWarning = ({ editingReusableStep, protocol, step, completed }) => {
  const usedInProtocolIndexes = (protocol, step) =>
    (step.usedInProtocols || [])
      .filter(usedInProtocol => usedInProtocol.protocolId !== protocol.id)
      .map(p => p.protocolNumber);

  if (editingReusableStep) {
    const protocolIndexes = usedInProtocolIndexes(protocol, step);
    const usedInProtocolsMessage = protocolIndexes.length > 0 ? ` The changes will also appear in protocols ${(renderUsedInProtocols(protocolIndexes))}.` : '';
    return (<Warning>{`You are editing all instances of this step.${usedInProtocolsMessage}`}</Warning>);
  } else if (!completed && step.existingValues && !step.saved) {
    const protocolIndexes = usedInProtocolIndexes(protocol, step);
    const usedInProtocolsMessage = protocolIndexes.length > 0 ? `  Changes made to this step will not appear where the '${step.existingValues.reference}' step is reused on protocols ${(renderUsedInProtocols(protocolIndexes))}.` : '';
    return (<Warning>{`You are editing only this instance of this step.${usedInProtocolsMessage}`}</Warning>);
  }
  return null;
};

const StepsRepeater = ({ values, prefix, updateItem, editable, project, isReviewStep, steps, reusableSteps, ...props }) => {
  // guard steps to a safe array inside the repeater
  const safeRepeaterSteps = Array.isArray(steps) ? steps : [];
  // Determine whether the last step is the "new placeholder" safely.
  const lastStep = safeRepeaterSteps.length ? safeRepeaterSteps[safeRepeaterSteps.length - 1] : null;
  const lastStepIsNew = lastStep ? isNewStep(lastStep) : false;

  //By default, reusable steps are updated always, but this is not true, hence adding ability to turn off when not needed
  const [updateReusable, setUpdateReusable] = useState(true);

  return (<Repeater
    type="steps"
    singular="step"
    prefix={prefix}
    items={safeRepeaterSteps}
    softDelete={true}
    onBeforeAdd={() => {
      setUpdateReusable(false);
    }}
    onSave={steps => {
      // Create deep clones of reusable steps to ensure immutability
      const reusableSteps = steps
        .filter(step => step.reusable && (step.completed || step.saved))
        .map(step => ({
          ...cloneDeep(step),
          id: step.reusableStepId || step.id,
          saved: true
        }));

      const mappedSteps = steps.map(step => {
        if (step.reusable && (step.completed || step.saved)) {
          return {
            id: step.id,
            reusableStepId: step.reusableStepId || step.id
          };
        }
        return step;
      });

      if (updateReusable && reusableSteps.length > 0) {
        props.dispatch(saveReusableSteps(reusableSteps));
      }
      updateItem({ steps: mappedSteps });
      setUpdateReusable(true); // Always reset this after save
    }}
    addAnother={!values.isStandardProtocol && !props.pdf && !values.deleted && editable && !lastStepIsNew}
    {...props}
  >
    <Step
      editable={editable}
      deleted={values.deleted}
      isReviewStep={isReviewStep}
      protocol={values}
      reusableSteps={reusableSteps}
      updateReusable={setUpdateReusable}
      {...props}
      parentUpdateItem={updateItem}
    />
  </Repeater>);
};

export default function Steps({project, values, ...props}) {
  const isReviewStep = parseInt(useParams().step, 10) === 1;
  const [ allSteps, reusableSteps ] = hydrateSteps(project.protocols, values.steps, project.reusableSteps || {});
  // project.protocols is an array. Get protocol-level flags from the current protocol `values`.
  const { isStandardProtocol = false, standardProtocolType = '' } = values || {};
   let steps;
   const prevProtocolsSteps = (props.previousProtocols && props.previousProtocols.steps) ? props.previousProtocols.steps : [];
   if (props.pdf) {
     steps = allSteps.filter(step => !step.deleted);
   } else {
     // use the guarded prevProtocolsSteps variable
     steps = removeNewDeleted(allSteps, prevProtocolsSteps);
     if (!props.editable && prevProtocolsSteps.length > props.index) {
       steps = addDeletedReusableSteps(steps, prevProtocolsSteps[props.index], reusableSteps);
     }
   }
   // Attach protocol flags to each step only when steps array has content
   if (Array.isArray(steps) && steps.length > 0) {
     steps = steps.map(step => ({ ...step, isStandardProtocol, standardProtocolType }));
   }
   const safeSteps = Array.isArray(steps) ? steps : [];

   // If editable and no real steps exist, render a single placeholder step so the Step
   // component can show the "create a new step or select reusable" UI. We don't want to
   // decorate this placeholder with protocol flags (that would break isNewStep detection).
   const displaySteps = (props.editable && safeSteps.length === 0) ? [{ id: uuid() }] : safeSteps;

   const [expanded, setExpanded] = useState(displaySteps.map(() => false));

  const setAllExpanded = (e) => {
    e.preventDefault();
    if (expanded.every(item => item)) {
      return setExpanded(expanded.map(() => false));
    }
    setExpanded(expanded.map(() => true));
  };
  const openCloseLink = (props.readonly || isReviewStep) && <p className="toggles">
    <a href="#" onClick={setAllExpanded}>
      {
        expanded.every(item => item)
          ? 'Close all steps'
          : 'Open all steps'
      }
    </a>
  </p>;

  const onToggleExpanded = (index) => {
    setExpanded(expanded.map((item, i) => {
      if (i === index) {
        return !item;
      }
      return item;
    }));
  };

  if (isReviewStep) {
    return (
      <div className="accordion">
        {openCloseLink}
        <StepsRepeater {...props}
          project={project}
          values={values}
          steps={displaySteps}
           reusableSteps={reusableSteps}
           isReviewStep={isReviewStep}
           expanded={expanded}
           onToggleExpanded={onToggleExpanded}
         />
      </div>);
  }

  return (
    <div className="accordion">
      <div className="steps">
        <p className="grey">{props.hint}</p>
        <br/>
        {openCloseLink}
        <StepsRepeater {...props}
          project={project}
          values={values}
          steps={displaySteps}
           reusableSteps={reusableSteps}
           isReviewStep={isReviewStep}
           expanded={expanded}
           onToggleExpanded={onToggleExpanded}
         />
      </div>
    </div>
  );
}
