import React from 'react';
import omit from 'lodash/omit';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import HomeOffice from '../components/home-office';
import rootReducer from '../reducers';
import {
  Breadcrumbs,
  StatusBar,
  Wrapper
} from '@ukhomeoffice/asl-components';

const Wrapped = ({ store, children }) => (
  <Provider store={store}>
    {children}
  </Provider>
);

const renderChildren = (children) => (
  <Wrapper>{children}</Wrapper>
);

const Layout = ({
  error,
  children,
  scripts: originalScripts = [],
  stylesheets: originalStylesheets = [],
  user,
  crumbs,
  footerLinks,
  contactUsLink,
  static: staticContent = {},
  phaseBannerSurvey,
  ...props
}) => {
  const {
    content: {
      siteTitle = 'Research and testing using animals',
      ...content
    } = {},
    urls,
    nonce,
    ...rest
  } = staticContent;

  // Create Redux store only if we want to wrap
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...omit(props, [
        'footerLinks',
        'settings',
        '_locals',
        'cache',
        'pageTitle'
      ]),
      static: { ...rest, content, urls }
    }
  });

  // Create new arrays without mutating props
  const stylesheets = ['/public/css/app.css', ...originalStylesheets];
  const scripts = originalScripts.length
    ? ['/public/js/common/bundle.js', ...originalScripts]
    : [];

  const page = (
    <HomeOffice
      title={props.pageTitle ? `${props.pageTitle} - ${siteTitle}` : siteTitle}
      propositionHeader={siteTitle}
      stylesheets={stylesheets}
      linkProps={{
        rel: 'preload',
        as: 'style',
        onLoad: 'this.onload=null;this.rel=\'stylesheet\''
      }}
      scripts={scripts}
      headerContent={<StatusBar user={user} />}
      nonce={nonce}
      footerLinks={footerLinks}
      contactUsLink={contactUsLink}
      phaseBanner={{
        phase: 'beta',
        feedbackUrl: '/feedback',
        ...props.phaseBanner
      }}
    >
      <div className="govuk-width-container">
        <Breadcrumbs crumbs={crumbs} />
        <main className="main govuk-main-wrapper" id="content">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
              <div id="page-component">
                {renderChildren(children)}
              </div>
            </div>
          </div>
        </main>
      </div>
      <script src="/public/js/common/base64.js" />
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
      function decode(str) { return JSON.parse(window.Base64.decode(str)); }
      window.INITIAL_STATE = decode('${Buffer.from(
      JSON.stringify(store.getState()),
      'utf8'
    ).toString('base64')}');
    `
        }}
      />

    </HomeOffice>
  );

  return <Wrapped store={store}>{page}</Wrapped>;
};

export default Layout;
