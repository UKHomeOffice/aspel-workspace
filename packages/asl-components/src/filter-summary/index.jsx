import React from 'react';
import { connect } from 'react-redux';

const FilterSummary = ({ total, filtered, filteredLabel, allShowingLabel, resultType = 'results' }) => {
  filteredLabel = filteredLabel || `${filtered} result${filtered === 1 ? '' : 's'}`;
  allShowingLabel = allShowingLabel || `All ${total} ${resultType}`;

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
