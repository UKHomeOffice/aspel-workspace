import React, { Fragment } from 'react';
import { Panel, Link, Snippet } from '../';

const Index = ({
  title,
  subtitle,
  nextSteps
}) => (
  <Fragment>
    <Panel title={title} className="green-bg">
      {
        subtitle && <h2>{ subtitle }</h2>
      }
    </Panel>

    {
      nextSteps && (
        <div className="what-next">
          <h2><Snippet>success.whatNext.title</Snippet></h2>
          <p>{ nextSteps }</p>
        </div>
      )
    }

    <Link page="dashboard" label={<Snippet>breadcrumbs.dashboard</Snippet>} />
  </Fragment>
);

export default Index;
