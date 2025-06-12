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

const renderChildren = (children, wrap) => (
  wrap ? <Wrapper>{children}</Wrapper> : children
);

const Layout = ({
  error,
  children,
  scripts = [],
  stylesheets = [],
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

  const wrap = !error;

  // Create Redux store only if we want to wrap
  const store = wrap
    ? configureStore({
      reducer: rootReducer,
      preloadedState: {
        ...omit(props, ['footerLinks', 'settings', '_locals', 'cache']),
        static: { ...rest, content, urls }
      }
    })
    : null;

  // Prepend common script if any scripts passed
  if (scripts.length) {
    scripts = ['/public/js/common/bundle.js', ...scripts];
  }

  const page = (
    <HomeOffice
      title={props.pageTitle ? `${props.pageTitle} - ${siteTitle}` : siteTitle}
      propositionHeader={siteTitle}
      stylesheets={['/public/css/app.css', ...stylesheets]}
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
                {renderChildren(children, wrap)}
              </div>
            </div>
          </div>
        </main>
      </div>
      {wrap && <script src="/public/js/common/base64.js" />}
      {wrap && store && (
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
      )}
    </HomeOffice>
  );

  return wrap ? <Wrapped store={store}>{page}</Wrapped> : page;
};

export default Layout;
