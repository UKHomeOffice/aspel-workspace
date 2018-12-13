import React, { Component } from 'react';
import Search from '../search';

class SearchPanel extends Component {
  render() {
    const labels = this.props.labels;
    const placeholders = this.props.placeholders;

    console.log(labels);

    return (
      <div className="search-panel">
        <h2>{this.props.title}</h2>
        <ul>
          <li>{labels.establishments}</li>
          <li>{labels.people}</li>
          <li>{labels.projects}</li>
        </ul>

        <div id="search-establishments">
          <Search placeholder={placeholders.establishments} />
        </div>
        <div id="search-people">
          <Search placeholder={placeholders.people} />
        </div>
        <div id="search-projects">
          <Search placeholder={placeholders.projects} />
        </div>
      </div>
    );
  }
}

export default SearchPanel;
