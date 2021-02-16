import React, { Fragment } from 'react';
import { Header, Link } from '@asl/components';

const Index = () => {

  return <Fragment>
    <Header title="Downloads"/>

    <h2>General downloads</h2>

    <h3><Link page="reporting" query={{ csv: 1 }} label="Completed tasks" /></h3>
    <p>View a list of all completed tasks by type, which you can download as a .csv file.</p>

    <h3><Link page="downloads.report" report="named-people" label="Named people and admins" /></h3>
    <p>View a list of contact details for all named people, admins, and HOLCs, which you can download as a .csv file.</p>

    <h2>Personal licence downloads</h2>

    <h3><Link page="downloads.report" report="training-pils" label="Category E" /></h3>
    <p>View a list of all category E PILs, which you can download as a .csv file.</p>

    <h3><Link page="downloads.report" report="pils" label="All other categories" /></h3>
    <p>View a list of all category A, B, C, D and F PILs, which you can download as a .csv file.</p>

    <h3><Link page="downloads.report" report="pil-reviews" label="Upcoming PIL reviews" /></h3>
    <p>View a list of PILs which are due a review, which you can download as a .csv file.</p>

    <h3><Link page="downloads.report" report="completed-pil-reviews" label="Completed PIL reviews" /></h3>
    <p>View a list of PIL reviews which have been submitted without changes, which you can download as a .csv file.</p>

    <h2>Project licence downloads</h2>

    <h3><Link page="downloads.report" report="ppl-list" label="Project list" /></h3>
    <p>Download a .csv file with summaries of the admin details of project licences such as expiry dates and statuses.</p>

    <h3><Link page="downloads.report" report="ppl-details" label="Project details" /></h3>
    <p>Download a .csv file containing details of project licences, including animal types, number of protocols and use of GA animals etc.</p>

    <h3><Link page="downloads.report" report="ppl-conditions" label="Project conditions and authorisations" /></h3>
    <p>Download a .csv file with summaries of the conditions and authorisations for each project.</p>

    <h3><Link page="downloads.report" report="ppl-sla" label="Expired statutory deadlines" /></h3>
    <p>View a list of all PPL applications which passed their statutory deadline, which you can download as a .csv file.</p>

    <h3><Link page="downloads.report" report="ppl-applications" label="PPL Applications" /></h3>
    <p>View a list of all PPL applications with a breakdown of time spent with the establishment and ASRU, which you can download as a .csv file.</p>

    <h2>Establishment licence downloads</h2>

    <h3><Link page="downloads.report" report="establishments" label="Establishment summaries" /></h3>
    <p>Download a .csv file with summaries of every establishment (name, licence number, PELH, Spocs, Inspectors, number of active PPLs, etc).</p>
  </Fragment>;
};

export default Index;
