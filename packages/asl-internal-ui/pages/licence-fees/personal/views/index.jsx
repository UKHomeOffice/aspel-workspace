import React from 'react';
import Layout from '../../views';
import { Datatable, Link } from '@asl/components';
import formatters from '@asl/pages/pages/establishment/licence-fees/personal/formatters';

export default function Personal() {
  return (
    <Layout tab={2}>
      <Datatable formatters={formatters} csv />
    </Layout>
  );
}
