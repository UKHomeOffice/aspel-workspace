import React from 'react';
import { connect } from 'react-redux';

const FilterSummary = ({ total, filtered, filteredLabel, allShowingLabel, recordType = 'results' }) => {
  filteredLabel = filteredLabel || `${filtered} results`;
  allShowingLabel = allShowingLabel || `All ${total} ${recordType}`;

  return (
    <h2 className="filter-summary">
      {
        filtered !== total
          ? filteredLabel
          : allShowingLabel
      }
    </h2>
  );
};

const mapStateToProps = ({
  datatable: {
    pagination: {
      count: filtered,
      totalCount: total
    }
  }
}) => ({
  total,
  filtered
});

export default connect(
  mapStateToProps
)(FilterSummary);
