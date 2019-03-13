import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';

import classnames from 'classnames';

import Expandable from '../../../components/expandable';
import Completable from '../../../components/completable';
import Complete from '../../../components/complete';
import Sections from './sections';

class ProtocolSections extends PureComponent {
  state = {
    expanded: this.props.editable && (this.props.parts || !this.props.values.complete)
  }

  setCompleted = value => {
    this.props.updateItem({ complete: value });
    this.setState({ expanded: !value })
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  toggleActive = e => {
    e.preventDefault();
    this.props.onToggleActive();
  }

  render() {
    const {
      values,
      sections,
      index,
      updateItem,
      editable
    } = this.props;

    const severityField = sections.details.fields.find(field => field.name === 'severity');
    const severityOption = severityField.options.find(option => option.value === values.severity);

    return (
      <section className={classnames('protocol', { complete: values.complete })}>
        <Expandable expanded={this.state.expanded} onHeaderClick={this.toggleExpanded}>
          <Completable status={values.complete ? 'complete' : 'incomplete'}>
            <h2 className="title inline-block">
              <span className="larger">{index + 1}. </span>{values.title}
            </h2>
            {
              editable && <a href="#" className="inline-block" onClick={this.toggleActive}>Edit title</a>
            }
            { severityOption &&
              <dl className="inline">
                <dt>Severity category: </dt>
                <dd className="grey">{severityOption.label}</dd>
              </dl>
            }
          </Completable>
          <div>
            <Sections
              {...this.props}
              onFieldChange={(key, value) => updateItem({ [key]: value })}
            />
            {
              editable && (
                <Complete
                  type="protocol"
                  complete={values.complete}
                  onChange={this.setCompleted}
                  buttonClassName="button-secondary"
                />
              )
            }
          </div>
        </Expandable>
      </section>
    )
  }
}

export default withRouter(ProtocolSections);
