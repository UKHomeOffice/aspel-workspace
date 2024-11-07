import React from 'react';
import { formatDate, DATE_FORMAT } from '../utils';
import { Inset } from '../';

const SINGULAR_CONTENT = {
    notice: 'A deadline and automated reminders have been set for this condition',
    deadline_list_intro: 'This condition has a deadline set for:',
    deadline_list_outro:
      'Licence holders will receive reminders 1 month before, 1 week before' +
      ' and on the deadline date. ASRU will receive a reminder when the' +
      ' deadline has passed.'
};

const PLURAL_CONTENT = {
    notice: 'Deadlines and automated reminders have been set for this condition',
    deadline_list_intro: 'This condition has deadlines set for:',
    deadline_list_outro:
      'Licence holders will receive reminders 1 month before, 1 week before' +
      ' and on each deadline date. ASRU will receive reminders when each' +
      ' deadline has passed.'
};

function ConditionReminders({ reminders, dateFormat = DATE_FORMAT.short }) {
    const activeReminders = (reminders ?? []).filter(reminder => reminder.deadline);

    if (activeReminders.length < 1) {
        return null;
    }

    const content = activeReminders.length === 1 ? SINGULAR_CONTENT : PLURAL_CONTENT;

    return (
        <div className="condition-reminders">
            <p><em>{content.notice}</em></p>
            <details>
                <summary>Show when deadlines and reminders have been scheduled</summary>
                <Inset>
                    <p>{content.deadline_list_intro}</p>
                    <ul>
                        {
                            reminders.map(reminder => (
                                <li key={reminder.id}>{formatDate(reminder.deadline, dateFormat)}</li>
                            ))
                        }
                    </ul>
                    <p>{content.deadline_list_outro}</p>
                </Inset>
            </details>
        </div>
    );
}

export default ConditionReminders;
