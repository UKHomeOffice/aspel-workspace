import React, { Component, Fragment } from 'react';
import { Button } from '@ukhomeoffice/react-components';

import compact from 'lodash/compact';

import Field from './field';

class OtherSpecies extends Component {
  state = {
    items: this.props.value && this.props.value.length
      ? this.props.value
      : [null]
  }

  addItem = () => {
    this.setState({
      items: [ ...this.state.items, null ]
    }, this.save);
  }

  updateItem = (item, index) => {
    const items = [...this.state.items];
    items[index] = item;
    this.setState({ items }, this.save);
  }

  removeItem = index => {
    if (this.state.items.length === 1) {
      return this.setState({ items: [null] }, this.save);
    }
    this.setState({
      items: this.state.items.filter((item, i) => i !== index)
    }, this.save);
  }

  save = () => {
    this.props.onFieldChange(`${this.props.name}`, compact(this.state.items));
  }

  render() {
    const {
      name,
      label = 'Specify other type of animal',
      itemLabel = 'Other species'
    } = this.props;
    const { items } = this.state;

    return (
      <Fragment key={items.length}>
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend">
            <h3 className="govuk-fieldset__heading">{ label }</h3>
          </legend>
          {
            items.map((item, index) => {
              const itemFieldLabel = `${itemLabel} ${index + 1}`;
              const itemFieldLabelLower = `${itemLabel.charAt(0).toLowerCase()}${itemLabel.slice(1)} ${index + 1}`;
              return (
                <div key={index} className="flex species-selector-other">
                  <div className="grow">
                    <Field
                      className="grow"
                      label={itemFieldLabel}
                      name={`${name}-${index}`}
                      type="text"
                      value={item}
                      onChange={value => this.updateItem(value, index)}
                      noComments={true}
                    />
                  </div>
                  {
                    items.length > 1 && (
                      <Button
                        className="link"
                        onClick={() => this.removeItem(index)}
                      >Remove {itemFieldLabelLower}</Button>
                    )
                  }
                </div>
              );
            })
          }
        </fieldset>
        <Button className="button-secondary" onClick={this.addItem}>Add another</Button>
      </Fragment>
    );
  }
}

export default OtherSpecies;
