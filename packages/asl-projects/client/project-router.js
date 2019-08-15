import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux'

import DownloadHeader from './components/download-header';
import ScrollToTop from './components/scroll-to-top';
import Section from './pages/section';
import Project from './pages/project';

const selector = ({
  application: {
    isSyncing,
    basename,
    drafting
  }
}) => ({ isSyncing, basename, drafting });

const ProjectRouter = () => {
  const [statusShowing, setStatusShowing] = useState(true);
  const {
    isSyncing,
    basename,
    drafting
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

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop>
        <DownloadHeader />
        <Switch>
          <Route path="/:section/:step?" render={props => <Section { ...props } drafting={drafting} />} />
          <Route path="/" component={Project} />
        </Switch>
      </ScrollToTop>
    </BrowserRouter>
  )
};

export default ProjectRouter;
