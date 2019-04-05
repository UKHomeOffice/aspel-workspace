import React, { Fragment} from 'react';
import { connect } from 'react-redux';
import { Snippet, FormLayout, Header } from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';

const Page = ({ asru, baseUrl }) => {
  return (

    <Fragment>
      {
        asru.map(profile => (
          <p key={`${profile.id}`}>{profile.firstName} {profile.lastName}
            <form method='POST' action={`${baseUrl}/delete`}>
              <input type="hidden" name="profileId" value={profile.id} />
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

const mapStateToProps = ({ static: { asru, baseUrl } }) => ({ asru, baseUrl });

export default connect(mapStateToProps)(Page);
