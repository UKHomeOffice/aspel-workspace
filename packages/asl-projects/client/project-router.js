import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux'
import { DownloadHeader } from '@asl/components';
import isEqual from 'lodash/isEqual';

import ScrollToTop from './components/scroll-to-top';
import Section from './pages/section';
import Project from './pages/project';
import ProtocolSummary from './pages/sections/protocols/summary-table';

const selector = ({
  project: version,
  savedProject,
  application: {
    readonly,
    editConditions,
    project,
    basename,
    drafting,
    isGranted,
    legacyGranted
  }
}) => {
  // only compare version data if version is in an editable state
  const editable = !readonly || editConditions;
  const isSyncing = editable && !isEqual(version, savedProject);
  return {
    project,
    version,
    isSyncing,
    basename,
    drafting,
    isGranted,
    legacyGranted
  };
};

const ProjectRouter = () => {
  const [statusShowing, setStatusShowing] = useState(true);
  const {
    project,
    version,
    isSyncing,
    basename,
    drafting,
    isGranted,
    legacyGranted
  } = useSelector(selector, shallowEqual);

  function toggleStatusShowing() {
    setStatusShowing(!statusShowing);
  }

  useEffect(() => {
    window.onbeforeunload = () => {
      if (isSyncing) {
        return true;
      }
    }

    const nextSteps = document.querySelector('#page-component > p.next-steps > a');
    const statusMessage = document.querySelector('#page-component > p.next-steps > span.status-message');

    if (isSyncing) {
      if (nextSteps) {
        nextSteps.setAttribute('disabled', true);
        nextSteps.onclick = () => false;
      }
      statusMessage && (statusMessage.innerText = 'Saving...');
    } else {
      if (nextSteps) {
        nextSteps.removeAttribute('disabled');
        nextSteps.onclick = null;
      }
      statusMessage && (statusMessage.innerText = '');
    }

    return () => {
      window.onbeforeunload = null;
      if (nextSteps) {
        nextSteps.removeAttribute('disabled');
        nextSteps.onclick = null;
      }
      statusMessage && (statusMessage.innerText = '');
    }
  })

  useEffect(() => {
    if (drafting) {
      return;
    }

    const licenceStatusBanner = document.querySelector('.licence-status-banner');

    if (!licenceStatusBanner) {
      return;
    }

    const showHide = licenceStatusBanner.querySelector('.toggle-switch a');
    const statusDetails = licenceStatusBanner.querySelector('.status-details');

    showHide.onclick = () => {
      if (statusShowing) {
        statusDetails.classList.add('hidden');
        licenceStatusBanner.classList.remove('open');
        showHide.innerText = 'Show more'
      } else {
        statusDetails.classList.remove('hidden');
        licenceStatusBanner.classList.add('open');
        showHide.innerText = 'Show less'
      }
      toggleStatusShowing();
    }
    return () => {
      showHide.onclick = null;
    };
  });

  const downloadBasename = basename.replace(/\/edit$/, '');

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop>

        <DownloadHeader
          title={version.title || 'Untitled project'}
          subtitle="Project licence"
          basename={downloadBasename}
          licenceStatus={ (project.status === 'active' && !(isGranted || legacyGranted)) ? 'inactive' : project.status }
          showAllDownloads={true}
        >
          <dl>
            <dt>Project title</dt>
            <dd>{version.title}</dd>

            <dt>Project licence holder</dt>
            <dd>{`${project.licenceHolder.firstName} ${project.licenceHolder.lastName}`}</dd>

            <dt>Primary establishment</dt>
            <dd>{project.establishment.name}</dd>

            <dt>Project licence number</dt>
            <dd>{project.licenceNumber}</dd>
          </dl>
        </DownloadHeader>

        <Switch>
          <Route path="/protocol-summary" component={ProtocolSummary} />
          <Route path="/:section/:step?" render={props => <Section { ...props } drafting={drafting} />} />
          <Route path="/" component={Project} />
        </Switch>

      </ScrollToTop>
    </BrowserRouter>
  )
};

export default ProjectRouter;
