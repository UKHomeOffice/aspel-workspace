import React, { Fragment } from 'react';
import {
  Datatable,
  Search,
  FilterSummary,
  Snippet,
  Link,
  Header
} from '@asl/components';

const formatters = {
  name: {
    format: (name, est) => {
      return <Link page="establishment.dashboard" establishmentId={ est.id } label={name} />;
    }
  }
};

const Index = () => (
  <Fragment>
    <Header title={<Snippet>pages.establishment.list</Snippet>} />

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <Search label={<Snippet>searchText</Snippet>} />
      </div>
    </div>

    <FilterSummary />
    <Datatable formatters={formatters} />
  </Fragment>
);

export default Index;
