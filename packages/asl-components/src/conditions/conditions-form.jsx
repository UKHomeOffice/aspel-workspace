import React, { Fragment, useState } from 'react';
import { Link, Snippet } from '../index';
import { TextArea, DateInput } from '@ukhomeoffice/react-components';
import { without } from 'lodash';
import { v4 as uuid } from 'uuid';
import validate from './validation';

const ConditionsForm = ({
    cancelLink,
    setEditing,
    setTempCondition,
    setTempReminders,
    tempReminders,
    tempConditions,
    taskData,
    ...props
}) => {

    const [ conditions, setConditions ] = useState(tempConditions);
    const [ reminders, setReminders ] = useState(tempReminders);
    const [ reveal, setReveal ] = useState(reminders.length === 0 ? [] : ['yes']);
    const [ error, setError ] = useState('');

    const onSave = () => {
        if (reveal.length > 0) {
            const error = validate(reminders);
            setError(error);
            if (error) { return; }
        }

        // if condition is deleted reveal will be empty, add deleted flag to reminder
        if (reveal.length === 0 && reminders[0]) {
            reminders[0].deleted = true;
        }

        // if reminder does not already exist give it an ID
        if (reminders[0] && !tempReminders[0]) {
            reminders[0].id = uuid();
        }
        setTempCondition(conditions);
        setTempReminders(reminders);
        setEditing(false);
    };

    const onChange = (e) => {
        setConditions(e.target.value);
    };

    const onDateChange = (date) => {
        setReminders([{ ...reminders[0], deadline: date }]);
    };

    const onCheck = (e) => {
        let v = e.target.value;
        if (reveal.includes(v)) {
            v = without(reveal, v);
        } else {
            v = [...reveal, v];
        }
        setReveal(v);
    };

    return (
        <Fragment>
            <TextArea
                label="Additional conditions"
                autoExpand={true}
                value={conditions}
                onChange={onChange}
                name="conditions"
                fieldName="conditions"
                { ...props } />
            <div className="govuk-form-group">
                <fieldset id="setReminder" className="govuk-fieldset smaller">
                    <div className="govuk-checkboxes">
                        <div className="govuk-checkboxes__item">
                            <input
                                name="setReminder"
                                type="checkbox"
                                className="govuk-checkboxes__input"
                                value='yes'
                                id="setReminder-yes"
                                onChange={onCheck}
                                checked={reveal.length > 0}
                            />
                            <label htmlFor="setReminder-yes" className="govuk-label govuk-checkboxes__label"><Snippet>reminders.set</Snippet></label>
                            {
                                reveal.length > 0 &&
                <div className="govuk-reveal">
                    <div className="govuk-inset-text">
                        <div className={!error ? 'govuk-form-group' : 'govuk-form-group govuk-form-group--error'}>
                            <fieldset className="govuk-fieldset" aria-describedby="deadline-hint">
                                <legend className="govuk-fieldset__legend">
                                    <h2 className="govuk-fieldset__heading govuk-heading-l"><Snippet>reminders.title</Snippet></h2>
                                </legend>
                                <span id="deadline-hint" className="govuk-hint"><Snippet>reminders.hint</Snippet></span>
                                {
                                    error && <span id="deadline-error" className="govuk-error-message"><span>{error}</span></span>
                                }
                                <DateInput {...props} id="deadline" onChange={onDateChange} value={reminders[0] ? reminders[0].deadline : null}/>
                            </fieldset>
                        </div>
                    </div>
                </div>
                            }
                        </div>
                    </div>
                </fieldset>
            </div>
            <div className="control-panel">
                <button type="button" className="govuk-button" onClick={onSave}><Snippet>buttons.save</Snippet></button>
                {
                    typeof cancelLink === 'string'
                        ? <Link page={cancelLink} label={<Snippet>buttons.cancel</Snippet>} {...props} />
                        : cancelLink
                }
            </div>
        </Fragment>
    );
};

export default ConditionsForm;
