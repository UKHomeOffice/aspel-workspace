import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Snippet } from '@ukhomeoffice/asl-components';
import { LogItem } from './activity-log/log-item';

export default function ActivityLog({ task }) {
  const [open, setOpen] = useState(false);
  const isAsru = useSelector((state) => state.static.isAsru);

  function toggle(e) {
    setOpen(!open);
  }

  if (!task.activityLog) {
    return null;
  }

  const activityLog = isAsru
    ? task.activityLog
    : task.activityLog.filter((a) => a.eventName !== 'assign');

  const latestActivity = activityLog[0];

  return (
    <div className="activity-log">
      <h2>
        <Snippet>sticky-nav.activity</Snippet>
      </h2>

      <LogItem key={latestActivity.id} item={latestActivity} task={task} />

      {activityLog.length > 1 && (
        <details>
          <summary onClick={toggle}>
            <Snippet>{open ? 'activityLog.close' : 'activityLog.open'}</Snippet>
          </summary>

          <div className="older-activity">
            <ul className="task-activity">
              {activityLog.slice(1).map((item) => (
                <li key={item.id}>
                  <LogItem item={item} task={task} />
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}
    </div>
  );
}
