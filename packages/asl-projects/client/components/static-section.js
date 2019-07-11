import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import ReviewFields from './review-fields';

const StaticSection = ({ section, project, fields = [], isGranted, subsection = false, ...props }) => {
  const Component = isGranted
    ? (section.granted && section.granted.review) || section.review || ReviewFields
    : section.review || ReviewFields;
  return (
    <Fragment>
      {
        subsection
          ? <h2>{section.title}</h2>
          : <h1>
            {
              isGranted
                ? (section.granted && section.granted.title) || section.title
                : section.title
            }
          </h1>
      }
      <Component {...section} fields={fields} values={project} {...props} />
    </Fragment>
  )
}

const mapStateToProps = ({ project, application: { isGranted } }, { section }) => {
  const fields = flatten([
    ...(section.fields || []),
    ...((section.steps || []).map(step => step.fields) || [])
  ]);

  return {
    project,
    fields,
    isGranted
  }
}

export default connect(mapStateToProps)(StaticSection);
