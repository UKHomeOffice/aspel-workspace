import React from 'react';
import Pdf from '../layouts/pdf';
import DataTable from '../containers/datatable';

export const formatters = {
  suitability: { format: value => value.join(', ') },
  holding: { format: value => value.join(', ') }
};

const PdfList = ({
  store,
  hostname
}) => {
  return (
    <Pdf hostname={hostname} >
      <DataTable store={store} formatters={ formatters } sortable={false} />
    </Pdf>
  );
};

export default PdfList;
