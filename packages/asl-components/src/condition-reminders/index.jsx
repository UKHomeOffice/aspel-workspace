import React from 'react';
import { format } from 'date-fns';
import { Inset } from '../';

function ConditionReminders({ reminders, dateFormat = 'dd/MM/yyyy' }) {
    if (!reminders || reminders.length < 1) {
        return null;
    }

    return (
        <div className="condition-reminders">
            <p><em>Automated reminders have been set for this condition</em></p>
            <details>
                <summary>Show when reminders have been scheduled</summary>
                <Inset>
                    <p>This condition has a reminder scheduled for:</p>
                    <ul>
                        {
                            reminders.map(reminder => (
                                <li key={reminder.id}>{format(reminder.deadline, dateFormat)}</li>
                            ))
                        }
                    </ul>
                    <p>
            Licence holders will receive reminders a month before, a week before and on the day the condition
            is due to be met. ASRU will receive a reminder when the deadline has passed.
                    </p>
                </Inset>
            </details>
        </div>
    );
}

export default ConditionReminders;
