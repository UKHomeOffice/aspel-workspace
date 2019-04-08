import React, { Fragment} from 'react';
import { connect } from 'react-redux';
import { Snippet, FormLayout, Header } from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';

const Page = ({ asru, baseUrl, asruUser }) => {
  return (

    <Fragment>
      {
        asru.map(profile => (
          <form key={profile.id} method='POST' action={`${baseUrl}/delete`}>
            <input type="hidden" name="profileId" value={profile.id} />
            <p>{profile.firstName} {profile.lastName}</p>
            <Button className='govuk-button add-margin'>
              <Snippet>buttons.remove</Snippet>
            </Button>
          </form>
        ))
      }

      <FormLayout>
        <Header title={<Snippet>{`title.${asruUser}`}</Snippet>}/>
      </FormLayout>
    </Fragment>
  );
};

const mapStateToProps = ({ static: { asru, baseUrl, asruUser } }) => ({ asru, baseUrl, asruUser });

export default connect(mapStateToProps)(Page);
