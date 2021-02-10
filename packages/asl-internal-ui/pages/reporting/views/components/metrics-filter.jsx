import React from 'react';
import merge from 'lodash/merge';
import { Form, Snippet, Link } from '@asl/components';
import DatePicker from './date-picker';
import EstablishmentSelect from './establishment-select';

export default function MetricsFilter({ start, end, establishment, page, query = {} }) {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <Form detachFields={true} className="metrics-filters">
          <p>
            Showing data <label htmlFor="start">from</label>:
            <DatePicker
              name="start"
              title="Start date"
              maxDate={new Date()}
              minDate={new Date(2019, 6, 31)}
              date={start}
            />
            <label htmlFor="end">to</label>
            <DatePicker
              name="end"
              title="End date"
              maxDate={new Date()}
              minDate={new Date(2019, 6, 31)}
              date={end}
            />
          </p>
          <p>
            <label htmlFor="establishment">
              Filter by establishment:
              <EstablishmentSelect
                className="inline"
                name="establishment"
                value={establishment}
              />
            </label>
            {
              establishment &&
                <Link page={page} query={merge({}, query, {establishment: 'all'})} label="Show all establishments" />
            }
          </p>
          <p className="control-panel">
            <button type="submit" className="govuk-button"><Snippet>buttons.submit</Snippet></button>
          </p>
        </Form>
      </div>
    </div>
  );
}
