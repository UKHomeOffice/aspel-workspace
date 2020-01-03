import React from 'react';
import merge from 'lodash/merge';
import Layout from '../../views';
import { Datatable, Link } from '@asl/components';
import formatters from '@asl/pages/pages/establishment/licence-fees/personal/formatters';
import format from 'date-fns/format';
import { dateFormat } from '@asl/pages/constants';

const localFormatters = {
  revocationDate: {
    format: date => date ? format(date, dateFormat.medium) : '-'
  }
};

export default function Personal() {
  return (
    <Layout tab={2}>
      <Datatable formatters={merge(formatters, localFormatters)} csv />
    </Layout>
  );
}
