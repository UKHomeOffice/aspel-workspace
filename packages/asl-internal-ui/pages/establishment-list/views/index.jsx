import React, { Fragment } from 'react';
import {
  ApplyChanges,
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

    <ApplyChanges type="form" onApply={() => this.emitChange()}>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Search label={<Snippet>searchText</Snippet>} />
        </div>
      </div>
    </ApplyChanges>

    <FilterSummary />
    <Datatable formatters={formatters} />
  </Fragment>
);

export default Index;
