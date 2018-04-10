const React = require('react');
const Pdf = require('./layouts/pdf');
const Table = require('./components/places-table');

const PdfList = props => {
  const { hostname } = props;
  const state = props.store.getState();
  return <Pdf {...state} hostname={hostname} >
    <Table rows={ state.list.filtered } />
  </Pdf>;
};

module.exports = PdfList;
