import React from 'react';
import { formatDate } from '../../../formatters';
import { ModelSummary } from '@ukhomeoffice/asl-components';

function buildModel(prefix, model) {
  if (model.courseDuration === 'one-day') {
    return {
      [`${prefix}CourseDate`]: model.courseDate ?? model.startDate
    };
  }

  if (model.courseDuration === 'multi-day') {
    return {
      [`${prefix}StartDate`]: model.startDate,
      [`${prefix}EndDate`]: model.endDate
    };
  }

  return {};
}

function buildSchema(prefix, model) {
  if (model.courseDuration === 'one-day') {
    return {
      [`${prefix}CourseDate`]: {}
    };
  }

  if (model.courseDuration === 'multi-day') {
    return {
      [`${prefix}StartDate`]: {},
      [`${prefix}EndDate`]: {}
    };
  }

  return {};
}

const buildFormatters = (prefix, model, comparison) => {
  const formatter = (base) => ({
    format: (date) => {
      const formattedDate = formatDate(date);
      if (comparison) {
        const formattedBase = formatDate(base);
        if (formattedBase !== formattedDate) {
          return <span className='highlight'>{formatDate(date)}</span>;
        }
      }

      return formattedDate;
    }
  });

  return {
    [`${prefix}CourseDate`]: formatter(comparison?.courseDate ?? comparison?.startDate),
    [`${prefix}StartDate`]: formatter(comparison?.startDate),
    [`${prefix}EndDate`]: formatter(comparison?.endDate)
  };
}
;

export default function DurationSummary({ prefix, model, comparison }) {
  return <>
    <ModelSummary
      model={buildModel(prefix, model)}
      schema={buildSchema(prefix, model)}
      formatters={buildFormatters(prefix, model, comparison)}
    />
  </>;
}
