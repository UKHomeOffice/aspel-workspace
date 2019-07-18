import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import ReviewFields from '../../../components/review-fields';
import { getSubsections } from '../../../schema';

const Locations = ({ values, schemaVersion }) => {
  const fields = get(getSubsections(schemaVersion), 'protocols.sections.details.fields');
  return (
    <div className="locations">
      <ReviewFields
        fields={fields.filter(f => f.name === 'locations')}
        values={values}
        />
    </div>
  );
};

export default connect(({ application: { schemaVersion } }) => ({ schemaVersion }))(Locations);
