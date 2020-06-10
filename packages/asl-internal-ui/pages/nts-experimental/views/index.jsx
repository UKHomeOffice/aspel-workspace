import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Header, Snippet, Link } from '@asl/components';

const Index = () => {
  const projectCounts = useSelector(state => state.static.projectCounts);
  return (
    <Fragment>

      <Header
        title={<Snippet>page.title</Snippet>}
        subtitle={<Snippet>page.subTitle</Snippet>}
      />

      <p><Snippet>page.summary</Snippet></p>

      <ul className="nts-downloads">
        {
          Object.keys(projectCounts).map(year => (
            <li key={year}>
              <Link url={`/non-technical-summaries`} path={year} label={<Snippet year={year} count={projectCounts[year]}>nts.link.label</Snippet>} />
            </li>
          ))
        }
      </ul>

      <p><a href="/">Home</a></p>

    </Fragment>
  );
};

export default Index;
