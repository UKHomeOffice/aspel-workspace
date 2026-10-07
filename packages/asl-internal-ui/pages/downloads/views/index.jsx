import React from 'react';
import { useSelector } from 'react-redux';
import { Header, Link, Tabs } from '@ukhomeoffice/asl-components';
import { useFeatureFlag, FEATURE_FLAG_NTS_DOCX } from '@asl/service/ui/feature-flag';
import CSVDownloads from './components/csv-downloads';
import NTSDownloads from './components/nts-downloads';

export default function Index() {
  const { reports } = useSelector(state => state.static);
  const query = useSelector(state => state.static.query);
  const tab = query && query.tab;
  const hasNtsDocxFlag = useFeatureFlag(FEATURE_FLAG_NTS_DOCX) || true;
  const tabs = hasNtsDocxFlag ? ['csv', 'nts'] : ['csv'];
  const activeTab = tabs.includes(tab) ? tab : 'csv';

  return (
    <div className="asru-downloads govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">

        <Header title="Downloads"/>

        <Tabs active={tabs.indexOf(activeTab)}>
          <Link page="downloads" query={{ tab: 'csv' }} label="CSV downloads" />
          {hasNtsDocxFlag && <Link page="downloads" query={{ tab: 'nts' }} label="NTS" />}
        </Tabs>

        {activeTab === 'nts' ? <NTSDownloads /> : <CSVDownloads reports={reports} />}

      </div>
    </div>
  );
}
