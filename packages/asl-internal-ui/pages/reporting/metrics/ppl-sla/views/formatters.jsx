import React from 'react';
import format from 'date-fns/format';
import { dateFormat } from '@asl/pages/constants';
import { Link } from '@asl/components';

export default {
  deadlineDate: {
    format: val => format(val, dateFormat.medium)
  },
  projectTitle: {
    format: (title, model) => <Link page="project.read" establishmentId={model.establishmentId} projectId={model.projectId} label={title} />
  },
  isExempt: {
    format: val => val === true ? <label className="badge blue">Not missed</label> : <label className="badge">Missed</label>
  }
};
