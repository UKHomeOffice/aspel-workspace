const React = require('react');
const ReactDOM = require('react-dom');
const Component = require('../../../views/pages/search');

ReactDOM.render(<Component {...window.INITIAL_STATE} />, document.getElementById('page-component'));
