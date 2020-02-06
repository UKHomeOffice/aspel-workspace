import React, { Fragment } from 'react';
import range from 'lodash/range';
import { Header, Snippet, Link } from '@asl/components';

const currentYear = new Date().getFullYear();
const supportedYears = range(currentYear, 2016, -1).map(String);

const Index = () => {

  return (
    <Fragment>

      <Header
        title={<Snippet>page.title</Snippet>}
        subtitle={<Snippet>page.subTitle</Snippet>}
      />

      <p><Snippet>page.summary</Snippet></p>

      <ul className="nts-downloads">
        {
          supportedYears.map(year => (
            <li key={year}>
              <Link url={`/non-technical-summaries`} path={year} label={<Snippet year={year}>nts.link.label</Snippet>} />
            </li>
          ))
        }
      </ul>

      <p><a href="/">Home</a></p>

    </Fragment>
  );
};

export default Index;
