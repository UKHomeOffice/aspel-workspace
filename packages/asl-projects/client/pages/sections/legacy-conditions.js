import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { updateConditions } from '../../actions/projects';
import AddConditions from '../../components/conditions/add-conditions';
import Condition from '../../components/conditions/condition';
import RetrospectiveAssessment from '../../components/retrospective-assessment';
import LEGACY_CONDITIONS from '../../constants/legacy-conditions';

function LegacyConditions({
  values,
  customTitle,
  showConditions,
  editConditions,
  standardConditions,
  pdf,
  ...props
}) {
  if (!showConditions) {
    return null;
  }
  const conditions = Object.keys(LEGACY_CONDITIONS).map(key => ({
    key,
    checked: !!(values.conditions || []).find(c => c.key === key),
    ...LEGACY_CONDITIONS[key]
  }));
  const custom = (values.conditions || []).find(value => value.key === 'custom');

  function handleConditionsChange(vals) {
    props.saveConditions([
      ...(custom ? [custom] : []),
      ...conditions.filter(c => vals.includes(c.key))
    ])
  }

  function updateCustom(content) {
    props.saveConditions([
      ...conditions,
      { key: 'custom', content }
    ]);
  }

  return (
    <Fragment>
      {
        !pdf && <RetrospectiveAssessment />
      }
      {
        editConditions
          ? (
            <Fragment>
              <AddConditions
                {...props}
                controls={false}
                conditions={conditions}
                onFieldChange={handleConditionsChange}
                showTitle={false}
              />
              <div className="govuk-form-group">
                <Condition
                  title={<h3>{customTitle}</h3>}
                  onUpdate={updateCustom}
                  content={custom && custom.content}
                  editable={true}
                  expandable={false}
                  allowEmpty
                />
              </div>
          </Fragment>
          )
          : (
            <Fragment>
              {
                (values.conditions || []).filter(c => c.key !== 'custom').map(condition => {
                  const content = LEGACY_CONDITIONS[condition.key];
                  return (
                    <Condition
                      className="purple-inset"
                      key={condition.key}
                      {...content}
                      editable={false}
                      expandable={false}
                    />
                  )
                })
              }
              <Condition
                className="purple-inset"
                title={customTitle}
                content={(custom || {}).content}
                editable={false}
                expandable={false}
              />
              <h2>Export of animals (transfer)</h2>
              <div className="purple-inset">
                <ReactMarkdown>{standardConditions}</ReactMarkdown>
              </div>
            </Fragment>
          )
      }
    </Fragment>
  )
}

export default connect(({
  application: {
    schemaVersion,
    showConditions,
    editConditions
  }
}) => ({
  isLegacy: schemaVersion === 0,
  showConditions,
  editConditions
}),
  dispatch => ({
    saveConditions: conditions => dispatch(updateConditions('legacy', conditions))
  })
)(LegacyConditions);
