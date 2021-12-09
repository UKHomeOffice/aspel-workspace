import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ExpiryDate, Link, Snippet } from '@asl/components';
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
  const { ropsSummary, downloadReady, hasPendingDownload, url } = useSelector(state => state.static);
  const refreshTimeoutSec = 10;

  useEffect(() => {
    if (hasPendingDownload) {
      setInterval(() => window.location.reload(false), refreshTimeoutSec * 1000);
    }

    if (downloadReady) {
      window.location.href = downloadReady;
    }
  });

  return (
    <div>
      <Header />
      <Tabs active={2} />
      <h2>Download returns</h2>

      {
        hasPendingDownload
          ? <p><strong>Download in progress - note, this can take up to 5 minutes. Please don&#39;t close this page.</strong></p>
          : <p>Download data for {ropsSummary.due} returns, including a list of establishment addresses.</p>
      }

      <form action={`${url}/download`} method="post">
        <Button type="Submit" disabled={hasPendingDownload}>Download returns</Button>
      </form>

      <span className="float-right align-right">
        <Link page="ropsReporting.download.dictionary" target="_blank" label={<Snippet>dictionaryLink.label</Snippet>} />
        <span className="govuk-hint"><Snippet>dictionaryLink.hint</Snippet></span>
      </span>

      <h2>Previous downloads</h2>

      <List schema={schema} />
    </div>
  );
}
