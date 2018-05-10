import React from 'react';

const FilterSummary = ({
  all,
  filtered
}) => (
  <p className="filter-summary">
    {
      filtered.length !== all.length
        ? `Showing ${filtered.length} of ${all.length} results`
        : `All ${all.length} results`
    }
  </p>
);

export default FilterSummary;
