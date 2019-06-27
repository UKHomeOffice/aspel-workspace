import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';
import {
  Snippet,
  FormLayout,
  Header,
  Inset,
  Fieldset
} from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';
import InProgressWarning from '../../../common/components/in-progress-warning';
import uuid from 'uuid/v4';

const connectComponent = value => {
  const mapStateToProps = ({ model, static: { schema, errors } }) => {

    schema = schema.authorisationTypes.options.find(authorisation => authorisation.value === value).reveal;

    console.log('connectComponent schema begin');
    console.log(JSON.stringify(schema));
    console.log('connectComponent schema end');

    const p = {
      model,
      errors,
      schema: mapKeys(schema, (v, k) => `authorisation-${value}-${k}`)
    };

    console.log('connectComponent p begin');
    console.log(JSON.stringify(p));
    console.log('connectComponent p end');

    return p;
  };

  return connect(mapStateToProps)(RepeatedFieldset);
};

class RepeatedFieldset extends Component {
  render () {
    return (
      <Repeat {...this.props} authorisations={this.props.model.authorisations.filter(a => a.type === this.props.type)} />
    );
  }
}

class Repeat extends Component {
  constructor(options) {
    super(options);

    console.log('Repeat props begin');
    console.log(JSON.stringify(this.props));
    console.log('Repeat props end');

    this.state = {
      authorisations: this.props.authorisations.length
        ? this.props.authorisations
        : [{ id: uuid() }]
    };

    this.addAnother = this.addAnother.bind(this);
    this.remove = this.remove.bind(this);
  }

  addAnother(e) {
    e.preventDefault();
    this.setState({
      authorisations: [
        ...this.state.authorisations,
        { id: uuid() }
      ]
    });
  }

  remove (id) {
    return e => {
      e.preventDefault();
      this.setState({
        authorisations: this.state.authorisations.filter(authorisation => authorisation.id !== id)
      });
    };
  }

  onFieldsetChange(index) {
    return (model) => {
      const { authorisations } = this.state;
      this.setState({
        authorisations: authorisations.map((authorisation, i) => {
          if (i === index) {
            return {
              ...authorisation,
              ...model
            };
          }
          return authorisation;
        })
      });
    };
  }

  render () {
    const { authorisations } = this.state || this.props;
    const { schema } = this.props;

    return <Fragment>
      {
        authorisations.map((authorisation, index) => {

          console.log('Repeat render model begin');
          console.log(JSON.stringify(mapKeys(authorisations[index], (val, key) => `authorisation-${authorisation.type}-${key}-${authorisation.id}`)));
          console.log('Repeat render model end');

          console.log('Repeat render schema begin');
          console.log(mapKeys(
            mapValues(schema,
              (value, key) => ({
                ...value,
                label: <Snippet>{`fields.${key}.label`}</Snippet>
              })),
            (value, key) => `${key}-${authorisation.id}`
          ));
          console.log('Repeat render schema end');

          // the specie is not repeated because it is not added to the model

          return (
            <Inset key={authorisation.id} className="repeater">
              <div>
                {
                  authorisations.length > 1 &&
                  <a href="#" onClick={this.remove(authorisation.id)} className="remove">
                    <Snippet>action.repeat.remove</Snippet>
                  </a>
                }
                <h3><Snippet index={index + 1}>repeat.title</Snippet></h3>
              </div>

              <Fieldset
                {...this.props}
                model={mapKeys(authorisations[index], (val, key) => `authorisation-${authorisation.type}-${key}-${authorisation.id}`)}
                onChange={this.onFieldsetChange(index)}
                schema={
                  mapKeys(
                    mapValues(schema,
                      (value, key) => ({
                        ...value,
                        label: <Snippet>{`fields.${key}.label`}</Snippet>
                      })),
                    (value, key) => `${key}-${authorisation.id}`
                  )
                }
              />
            </Inset>
          );
        })
      }

      <Button onClick={this.addAnother} className="button-secondary">
        <Snippet>action.repeat.add</Snippet>
      </Button>
    </Fragment>;
  }
}

const formatters = {
  authorisationTypes: {
    mapOptions: op => {
      const ConnectedComponent = connectComponent(op.value);
      return {
        ...op,
        prefix: op.value,
        reveal: <ConnectedComponent type={op.value} />
      };
    }
  }
};

const Page = ({ model, openTask }) => {
  if (openTask) {
    return <InProgressWarning task={openTask} />;
  }

  return (
    <FormLayout formatters={formatters}>
      <Header title={<Snippet>pages.establishment.edit</Snippet>} />
    </FormLayout>
  );
};

const mapStateToProps = ({ model, static: { openTask } }) => ({ model, openTask });

export default connect(mapStateToProps)(Page);
