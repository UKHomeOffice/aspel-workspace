import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Snippet, FormLayout, Fieldset, Inset, Header } from '@asl/components';

const connectComponent = key => {
  const mapStateToProps = ({ model, static: { schema } }) => {
    schema = schema.type.options.find(role => role.value === key).reveal;

    return {
      model,
      schema
    };
  };

  return connect(mapStateToProps)(Fieldset);
};

const formatters = {
  type: {
    mapOptions: option => {
      const ConnectedComponent = connectComponent(option.value);
      return {
        ...option,
        reveal: option.reveal ? <Inset><ConnectedComponent /></Inset> : null
      };
    }
  }
};

const Page = () => {
  return (
    <Fragment>
      <FormLayout formatters={formatters}>
        <Header title={<Snippet>title</Snippet>}/>
      </FormLayout>

      <p>
        <Link page="profile.read" label={<Snippet>buttons.cancel</Snippet>} />
      </p>
    </Fragment>
  );
};

export default Page;
