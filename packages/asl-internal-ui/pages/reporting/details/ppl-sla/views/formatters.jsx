import React from 'react';
import { format } from 'date-fns';
import { dateFormat } from '@asl/pages/constants';
import { Link } from '@ukhomeoffice/asl-components';

export default {
  deadlinePassedDate: {
    format: val => format(val, dateFormat.medium)
  },
  projectTitle: {
    format: (title, task) => (
      <Link page="project.read" establishmentId={task.data.modelData.establishmentId} projectId={task.data.modelData.id} label={title} />
    )
  },
  isExempt: {
    format: val => val === true ? <label className="badge blue">Not missed</label> : <label className="badge">Missed</label>
  }
};
