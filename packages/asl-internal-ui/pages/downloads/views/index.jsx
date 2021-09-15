import React from 'react';
import { Header, Link } from '@asl/components';

export default function Index() {
  return (
    <div className="asru-downloads govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">

        <Header title="Downloads"/>

        <p>Download data from the animals in science e-licensing system (ASPeL) since it started use on 31 July 2019.</p>

        <section>
          <h2>Project licences</h2>

          <Link page="downloads.report" report="ppl-list" label="Project licences" />
          <p className="file-type-label">CSV</p>
          <p>Download a list of all active and revoked project licences including duration, expiry date and establishment number.</p>

          <Link page="downloads.report" report="ppl-details" label="Project licence authorities" />
          <p className="file-type-label">CSV</p>
          <p>Download a list of all active and revoked project authorities including animal type, permissible purpose and highest severity.</p>

          <Link page="downloads.report" report="ppl-conditions" label="Project conditions and authorisations" />
          <p className="file-type-label">CSV</p>
          <p>Download a list of all active and revoked project conditions and authorisations.</p>

          <Link page="downloads.report" report="ppl-protocols" label="Project protocols" />
          <p className="file-type-label">CSV</p>
          <p>Download a list of all active and revoked project protocols.</p>

          <Link page="downloads.report" report="ppl-applications" label="Project applications granted" />
          <p className="file-type-label">CSV</p>
          <p>Download a list of new project licence applications granted in ASPeL, including a breakdown of time spent with the establishment and the Home Office.</p>

          <Link page="downloads.report" report="ppl-sla" label="Expired statutory deadlines" />
          <p className="file-type-label">CSV</p>
          <p>Download a list of project licence applications that weren’t processed within the Home Office’s statutory deadline.</p>
        </section>

        <section>
          <h2>Personal licences</h2>

          <Link page="downloads.report" report="pils" label="Category A, B, C, D and F licences" />
          <p className="file-type-label">CSV</p>
          <p>Download a list of all category A, B, C, D and F personal licences granted in ASPeL.</p>

          <Link page="downloads.report" report="training-pils" label="Category E licences" />
          <p className="file-type-label">CSV</p>
          <p>Download a list of all category E personal licences granted in ASPeL.</p>

          <Link page="downloads.report" report="pil-reviews" label="Upcoming personal licence reviews" />
          <p className="file-type-label">CSV</p>
          <p>Download a list of all personal licences due a review.</p>

          <Link page="downloads.report" report="completed-pil-reviews" label="Completed personal licence reviews" />
          <p className="file-type-label">CSV</p>
          <p>Download a list of personal licences that have been reviewed with no changes to the licence.</p>
        </section>

        <section>
          <h2>Establishment licences</h2>

          <Link page="downloads.report" report="establishments" label="Establishment licences" />
          <p className="file-type-label">CSV</p>
          <p>Download a list of all active and revoked establishment licences including details of the licence holder, Home Office Liaison Contact and number of active projects.</p>

          <Link page="downloads.report" report="establishment-conditions" label="Establishment conditions and authorisations" />
          <p className="file-type-label">CSV</p>
          <p>Download a list active and revoked establishment conditions and authorisations.</p>
        </section>

        <section>
          <h2>Establishments users</h2>

          <Link page="downloads.report" report="named-people" label="Named people and admins" />
          <p className="file-type-label">CSV</p>
          <p>View a list of contact details for all named people, admins, and HOLCs, which you can download as a .csv file.</p>
        </section>

        <section>
          <h2>Other downloads</h2>
          <p>You can <Link page="reporting" query={{ csv: 1 }} label="view and download more data on tasks completed in ASPeL" />.</p>
        </section>

      </div>
    </div>
  );
}
