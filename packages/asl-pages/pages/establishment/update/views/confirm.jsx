import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { ApplicationConfirm, ControlBar, Diff, ErrorSummary, Field, Header, Snippet } from '@asl/components';
import { hasChanged } from '../../../../lib/utils';
import formatters from '../../formatters';
import Authorisations from './authorisations';

const Confirm = ({ model, values, csrfToken }) => {
  return (
    <Fragment>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <ErrorSummary />

          <Header title={<Snippet>pages.establishment.confirm</Snippet>} />
          <h2><Snippet>subtitle</Snippet></h2>

          <Diff comparator={hasChanged} formatters={formatters} />

          <Authorisations model={model} values={values} />

          {
            values && values.comments && (
              <Field
                title={<Snippet>fields.comments.label</Snippet>}
                content={values.comments}
              />
            )
          }

          <ControlBar>
            <a href="?edit=true"><Snippet>buttons.edit</Snippet></a>
            <a href="?clear=true"><Snippet>buttons.cancel</Snippet></a>
          </ControlBar>

          <form method="POST">
            <input type="hidden" name="_csrf" value={csrfToken} />
            <ApplicationConfirm />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = ({ model, static: { values, csrfToken } }) => ({ model, values, csrfToken });

export default connect(mapStateToProps)(Confirm);
