import React, { Fragment } from 'react';
import { Value } from 'slate';
import Review from '../../../components/review';
import ReviewFields from '../../../components/review-fields';

const Step = ({ id, index, fields, ...props }) => {
  return (
    <div className="granted-step" id={id}>
      <div className="header">
        <h2 className="step-number">Step {index + 1} <span className="smaller">({ props.optional ? 'Optional' : 'Mandatory'})</span></h2>
        <Review
          {...fields.find(f => f.name === 'title')}
          label=""
          value={props.title}
        />
      </div>
      <div className="body">
        {
          props.adverse === true
            ? (
              <ReviewFields
                fields={fields.find(f => f.name === 'adverse').options.find(o => o.label === 'Yes').reveal}
                values={props}
              />
            )
            : (
              <h3>This step will have no adverse effects that are more than mild and transient.</h3>
            )
        }
      </div>
      {
        !props.pdf && (
          <p className="steps-back-to-top">
            <a href="#step-index">Back to steps index</a>
          </p>
        )
      }
    </div>
  )
}

const Steps = ({ values, fields, pdf, number }) => {
  const getStepTitle = title => {
    const untitled = <em>Untitled step</em>;
    if (!title) {
      return untitled;
    }
    const value = Value.fromJSON(JSON.parse(title));
    return value.document.text && value.document.text !== ''
      ? value.document.text
      : untitled;
  };

  return (
    <div className="granted-steps">
      {
        pdf && <h2>{`Protocol ${number} steps`}</h2>
      }
      {
        !pdf && (
          <Fragment>
            <h3 id="step-index">Index of steps</h3>
            <ol>
              {
                values.steps.map((step, index) => (
                  <li key={step.id} className="step-index-item">
                    <span>{index + 1}. </span>
                    <a href={`#${step.id}`}>{getStepTitle(step.title)}</a><br />
                    <span>{step.optional ? 'Optional' : 'Mandatory'}</span>
                  </li>
                ))
              }
            </ol>
            <h3>You may perform these steps in any order</h3>
          </Fragment>
        )
      }
      {
        values.steps.map((step, index) => <Step key={step.id} {...step} index={index} fields={fields} pdf={pdf} />)
      }
    </div>
  )
}

export default Steps;
