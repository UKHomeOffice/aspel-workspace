import React, { useState, Fragment } from 'react';
import { Form, Markdown, Inset, ConditionReminders, Snippet } from '../';
import ConditionsForm from './conditions-form';

function Conditions({
    conditions,
    label,
    noConditionsLabel,
    canUpdate,
    children,
    editing = false,
    addLabel = 'Add conditions',
    updateLabel = 'Update conditions',
    reminders = [],
    taskData,
    isComplete
}) {
    const [isEditing, setEditing] = useState(editing);
    const [ tempCondition, setTempCondition ] = useState(conditions);
    let [ tempReminders, setTempReminders ] = useState(reminders);
    conditions = tempCondition;

    function toggleEdit(e) {
        e.preventDefault();
        setEditing(!isEditing);
    }

    const CancelLink = <a href="#" onClick={toggleEdit}><Snippet>buttons.cancel</Snippet></a>;

    // get the reminders in the correct format for them to be consumed and added to DB
    let formatReminders;
    if (taskData && tempReminders[0]) {
        formatReminders = {
            id: tempReminders[0].id || null,
            deadline: tempReminders[0].deadline || null,
            deleted: tempReminders[0].deleted || null
        };

        // if reminder is deleted do not display it
        if (formatReminders.deleted) {
            tempReminders = [];
        }
    }

    return (
        <div className="conditions">
            <p>{ conditions ? label : noConditionsLabel }</p>
            {
                isEditing && canUpdate
                    ? (
                        <Fragment>
                            {
                                !taskData
                                    ? <Form cancelLink={CancelLink} />
                                    : <ConditionsForm
                                        cancelLink={CancelLink}
                                        setEditing={setEditing}
                                        tempConditions={tempCondition}
                                        tempReminders={tempReminders}
                                        setTempCondition={setTempCondition}
                                        setTempReminders={setTempReminders}
                                        taskData={taskData}/>
                            }
                        </Fragment>
                    )
                    : (
                        <Fragment>
                            {
                                conditions &&
                <Fragment>
                    <Inset className="condition"><Markdown>{ tempCondition }</Markdown></Inset>
                    <ConditionReminders reminders={ tempReminders } />
                </Fragment>
                            }
                            {
                                canUpdate && !isComplete && <a href="#" onClick={toggleEdit}>{conditions ? updateLabel : addLabel }</a>
                            }
                            {
                                taskData &&
                <Fragment>
                    <input type="hidden" name="conditions" value={tempCondition}/>
                    <input type="hidden" name="reminders" value={JSON.stringify(formatReminders)}/>
                </Fragment>
                            }
                        </Fragment>
                    )
            }
            { children }
        </div>
    );
}

export default Conditions;
