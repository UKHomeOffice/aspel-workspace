import React from 'react';
import { format, getYear } from 'date-fns';
import { Link } from '@ukhomeoffice/asl-components';
import { dateFormat } from '../../../constants';
import { trainingCoursePurpose } from '@ukhomeoffice/asl-constants';
import taskFormatters from '../../task/list/formatters';
import classnames from 'classnames';

const formatDate = date => date ? format(date, dateFormat.long) : '-';

export default {
  courseTitle: {
    format: (title, model) =>
      <Link
        page="categoryE.course.read"
        trainingCourseId={model.id}
        label={title}
      />
  },
  startDate: {
    format: (startDate, { endDate }) => {
      if (!endDate) {
        return formatDate(startDate, dateFormat.medium);
      } else {
        const startDateFormat = getYear(startDate) === getYear(endDate)
          ? 'dd MMM'
          : dateFormat.medium;

        return `${formatDate(startDate, startDateFormat)} - ${formatDate(endDate, dateFormat.medium)}`;
      }
    }
  },
  projectId: {
    format: (id, model) => {
      return model.project && <Link
        page="project.read"
        projectId={id}
        establishmentId={model.project.establishmentId}
        label={model.project.licenceNumber}
      />;
    }
  },
  profile: {
    format: ({id, firstName, lastName}, model) =>
      id
        ? <Link
          page='profile.read'
          profileId={id}
          establishmentId={model.data.establishmentId}
          label={`${firstName} ${lastName}`}
        />
        : `${firstName} ${lastName}`
  },
  coursePurpose: {
    format: purpose => trainingCoursePurpose[purpose]
  },
  status: {
    format: (status, model) => {
      const visibleTaskStatuses = [
        'discarded-by-applicant',
        'rejected'
      ];
      if (model.modelStatus === 'inactive' || visibleTaskStatuses.includes(status)) {
        return taskFormatters.status.format(status, model);
      }
      const bad = ['expired', 'transferred', 'revoked'];
      const good = ['active'];
      const className = classnames({ badge: true, complete: good.includes(model.modelStatus), rejected: bad.includes(model.modelStatus) });
      return <span className={ className }>{model.modelStatus.toUpperCase()}</span>;
    }
  },
  species: {
    format: species =>
      !species || species.length === 0
        ? '-'
        : species.sort().join(', ')
  },
  licenceDetails: {
    format(trainingPilId, model) {
      if (trainingPilId && model.modelStatus === 'active') {
        return <Link
          page='category-e.licence.read'
          trainingPilId={trainingPilId}
          establishmentId={model.data.establishmentId}
          label
        />;
      }

    }
  }
};
