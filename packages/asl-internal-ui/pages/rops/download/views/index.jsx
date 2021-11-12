import React from 'react';
import { useSelector } from 'react-redux';
import { ExpiryDate, Link } from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';

import Header from '../../components/header';
import Tabs from '../../components/tabs';
import List from '../components/list';

const schema = {
  updatedAt: {
    format: value => <ExpiryDate date={value} dateFormat="D MMM YYYY, HH:mm" showNotice={false} />
  },
  profile: {
    format: profile => <Link page="globalProfile" profileId={profile.id} label={`${profile.firstName} ${profile.lastName}`} />
  },
  due: {
    format: (_, row) => row.ready && row.meta ? row.meta.due : '-'
  },
  submitted: {
    format: (_, row) => row.ready && row.meta ? row.meta.submitted : '-'
  },
  outstanding: {
    format: (_, row) => row.ready && row.meta ? (row.meta.due - row.meta.submitted) : '-'
  },
  download: {
    format: (_, row) => row.ready ? <Link page="ropsReporting.download.export" exportId={row.id} label="Download" /> : 'Pending'
  }
};

export default function Index() {
  const { ropsSummary } = useSelector(state => state.static);
  const rows = useSelector(state => state.model);
  const hasPendingDownload = !!rows.some(row => !row.ready);

  return (
    <div>
      <Header />

      <Tabs active={2} />

      <h2>Download returns</h2>
      <p>Download data for {ropsSummary.due} returns, including a list of establishment addresses.</p>
      <form action="" method="post">
        <Button type="Submit" disabled={hasPendingDownload}>Download returns</Button>
      </form>

      <Link className="float-right" page="ropsReporting.download.dictionary" newTab={true} label="View data dictionary" />

      <h2>Previous downloads</h2>

      <List schema={schema} />
    </div>
  );
}
