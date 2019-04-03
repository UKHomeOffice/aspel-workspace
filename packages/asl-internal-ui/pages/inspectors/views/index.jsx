import React, { Fragment} from 'react';
import { connect } from 'react-redux';
import { Snippet, FormLayout, Header } from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';

const Page = ({ inspectors, baseUrl }) => {
  return (

    <Fragment>
      {
        inspectors.map(inspector => (
          <p key={`${inspector.establishmentId}-${inspector.profileId}`}>{inspector.profile.firstName} {inspector.profile.lastName}
            <form method='POST' action={`${baseUrl}/delete`}>
              <input type="hidden" name="profileId" value={inspector.profileId} />
              <input type="hidden" name="establishmentId" value={inspector.establishmentId} />
              <p className="control-panel">
                <Button className='govuk-button add-margin'>
                  <Snippet>buttons.remove</Snippet>
                </Button>
              </p>
            </form>
          </p>
        ))
      }

      <FormLayout>
        <Header title={<Snippet>title</Snippet>}/>
      </FormLayout>
    </Fragment>
  );
};

const mapStateToProps = ({ static: { inspectors, baseUrl } }) => ({ inspectors, baseUrl });

export default connect(mapStateToProps)(Page);
