import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Layout from '../../views';
import { Datatable, Link, Snippet } from '@asl/components';
import { numberWithCommas } from '@asl/pages/lib/utils';

export default function Establishments() {
  const { personalFee, year } = useSelector(state => state.static.fees, shallowEqual);

  const formatters = {
    name: {
      format: (name, model) => <Link page="establishment.fees.overview" label={name} establishmentId={model.id} year={year} />
    },
    licenceNumber: {
      format: (licenceNumber, model) => <Link page="establishment.read" label={licenceNumber} establishmentId={model.id} />
    },
    numberOfPils: {
      format: (numberOfPils, model) => parseInt(numberOfPils, 10) + parseInt(model.numberOfTransferredPils, 10)
    },
    totalCost: {
      format: (numberOfPils, model) => `£${numberWithCommas((parseInt(numberOfPils, 10) + parseInt(model.numberOfTransferredPils, 10)) * personalFee)}`
    }
  }

  return (
    <Layout tab={1}>
      <Datatable formatters={formatters} csv />
    </Layout>
  );
}
