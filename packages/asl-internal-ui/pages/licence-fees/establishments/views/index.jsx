import React from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../views';
import { Datatable, Link, Search, CSVDownloadLink } from '@asl/components';
import { numberWithCommas } from '@asl/pages/lib/utils';

export default function Establishments() {
  const { year } = useSelector(state => state.static.fees);

  const formatters = {
    name: {
      format: (name, model) => <Link page="establishment.fees.overview" label={name} establishmentId={model.id} year={year} />
    },
    licenceNumber: {
      format: (licenceNumber, model) => <Link page="establishment.read" label={licenceNumber || <em>Draft</em>} establishmentId={model.id} />
    },
    numberOfPils: {
      format: value => numberWithCommas(value)
    },
    total: {
      format: sum => `£${numberWithCommas(sum)}`
    }
  };

  return (
    <Layout tab={1}>
      <CSVDownloadLink />
      <Search />
      <Datatable formatters={formatters} csv />
    </Layout>
  );
}
