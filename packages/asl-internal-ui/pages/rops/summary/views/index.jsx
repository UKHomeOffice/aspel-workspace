import React from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/header';
import Tabs from '../../components/tabs';

export default function Index() {
  const { year, ropsSummary } = useSelector(state => state.static);

  return (
    <div>
      <Header />
      <Tabs />
      <div className="rops-summary">

        <h2>Returns due in {year}</h2>
        <dl className="inline">
          <dt>Total returns due in {year}</dt><dd>{ropsSummary.due}</dd>
        </dl>

        <h2>Returns submitted</h2>
        <dl className="inline">
          <dt>Total returns submitted</dt><dd>{ropsSummary.submitted}</dd>
        </dl>

        <h2>Returns outstanding</h2>
        <dl className="inline">
          <dt>Total returns outstanding</dt><dd>{ropsSummary.outstanding}</dd>
          <dt>Returns overdue</dt><dd>{ropsSummary.overdue}</dd>
        </dl>

      </div>
    </div>
  );
}
