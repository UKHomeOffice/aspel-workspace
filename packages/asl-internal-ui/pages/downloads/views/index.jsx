import React, { Fragment } from 'react';
import { Header, Link } from '@asl/components';

const Index = () => {

  return <Fragment>
    <Header title="Downloads"/>

    <h2>General downloads</h2>
    <p><Link page="reporting" query={{ csv: 1 }} label="Completed tasks" /></p>
    <p>View a list of all completed tasks by type, which will be downloadable in a .csv file.</p>

    <h2>Project licence downloads</h2>
    <p><Link page="nts" label="Non-technical summaries by year" /></p>
    <p>View a list of all non-technical summaries by year, which will be downloadable in a .zip file.</p>
  </Fragment>
};

export default Index;
