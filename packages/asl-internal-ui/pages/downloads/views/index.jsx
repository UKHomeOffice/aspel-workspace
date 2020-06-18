import React, { Fragment } from 'react';
import { Header, Link } from '@asl/components';

const Index = () => {

  return <Fragment>
    <Header title="Downloads"/>

    <h2>General downloads</h2>

    <h3><Link page="reporting" query={{ csv: 1 }} label="Completed tasks" /></h3>
    <p>View a list of all completed tasks by type, which will be downloadable in a .csv file.</p>

    <h3><Link page="downloads.report" report="named-people" label="Named people and admins" /></h3>
    <p>View a list of contact details for all named people, admins, and HOLCs, which will be downloadable in a .csv file.</p>

    <h2>Personal licence downloads</h2>

    <h3><Link page="downloads.report" report="pils" label="All PILs" /></h3>
    <p>View a list of all active and revoked PILs, which will be downloadable in a .csv file.</p>

    <h3><Link page="downloads.report" report="pil-reviews" label="Upcoming PIL reviews" /></h3>
    <p>View a list of PILs which are due a review, which will be downloadable in a .csv file.</p>

    <h2>Project licence downloads</h2>

    <h3><Link page="downloads.report" report="ppl-list" label="Project list" /></h3>
    <p>Download a .csv file with summaries of the admin details of project licences such as expiry dates and statuses.</p>

    <h3><Link page="downloads.report" report="ppl-conditions" label="Project conditions and authorisations" /></h3>
    <p>Download a .csv file with summaries of the conditions and authorisations for each project.</p>

    <h3><Link page="nts" label="Non-technical summaries by year" /></h3>
    <p>View a list of all non-technical summaries by year, which will be downloadable in a .zip file.</p>

    <h3><Link page="downloads.report" report="ppl-sla" label="Expired statutory deadlines" /></h3>
    <p>View a list of all PPL applications which passed their statutory deadline, which will be downloadable in a .csv file.</p>
  </Fragment>;
};

export default Index;
