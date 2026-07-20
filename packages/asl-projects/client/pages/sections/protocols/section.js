import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Fieldset from '../../../components/fieldset';
import ReviewFields from '../../../components/review-fields';
import { resolveFieldValue } from '../../../helpers/field-resolution';

class Section extends PureComponent {
  render() {
    const {
      label,
      fields,
      values,
      onFieldChange,
      prefix,
      editable,
      pdf,
      title,
      project
    } = this.props;

    const fieldContext = {
      ...project,
      ...values,
      readonly: !editable || values.deleted,
      values
    };
    const resolvedLabel = resolveFieldValue(label, fieldContext);

    const visibleFields = fields.filter(f => f.show === undefined || f.show(fieldContext));

    return (
      <Fragment>
        {
          pdf && <h2>{title}</h2>
        }
        { resolvedLabel && <h4>{resolvedLabel}</h4> }
        {
          editable && !values.deleted
            ? (
              <Fieldset
                fields={visibleFields}
                values={values}
                prefix={prefix}
                onFieldChange={onFieldChange}
              />
            )
            : (
              <ReviewFields
                fields={visibleFields}
                values={values}
                prefix={prefix}
                editLink={`0#${prefix}`}
                readonly={values.deleted}
              />
            )
        }
      </Fragment>
    );
  }
}

const mapStateToProps = ({ project }) => {
  return { project };
};

export default withRouter(connect(mapStateToProps)(Section));
