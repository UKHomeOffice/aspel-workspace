import React, { Component, useState, Fragment } from 'react';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Button } from '@ukhomeoffice/react-components';
import CONDITIONS from '../../constants/conditions';

import Editable from '../editable';

function Condition({
  title,
  deleted,
  updating,
  edited,
  content,
  custom,
  inspectorAdded,
  number,
  singular,
  className,
  onSave,
  onRemove,
  editConditions
}) {
  const [editing, setEditing] = useState(false);

  function handleSave(edited) {
    onSave({ edited })
      .then(() => setEditing(false));
  }

  function handleRevert() {
    onSave({ edited: null })
      .then(() => setEditing(false));
  }

  const displayContent = edited || content;

  return (
    <div className={className}>
      <h2>{singular} {number}</h2>
      <div className={classnames('condition', { deleted })}>
        <h3>{title}</h3>
        {
          deleted
            ? (
              <Fragment>
                <em>This {singular.toLowerCase()} has been removed</em>
                <p>
                  <Button
                    disabled={updating}
                    className="link"
                    onClick={onSave.bind(null, { deleted: false })}
                  >
                    Restore
                  </Button>
                </p>
              </Fragment>
            )
            : (
              <Fragment>
                {
                  editing && editConditions
                    ? <Editable
                      content={displayContent}
                      edited={!!edited}
                      updating={updating}
                      onSave={handleSave}
                      onCancel={setEditing.bind(null, false)}
                      onRevert={handleRevert}
                      showRevert={!custom}
                    />
                  : <ReactMarkdown className="condition-text">{displayContent}</ReactMarkdown>
                }
              </Fragment>
            )
        }
      </div>
      {
        editConditions && !editing && (
          <p>
            <Button
              disabled={updating}
              className="link"
              onClick={setEditing.bind(null, true)}
            >
              Edit
            </Button>
            {' | '}
            <Button
              disabled={updating}
              className="link"
              onClick={onRemove.bind(null, custom || inspectorAdded)}
            >
              Remove
            </Button>
          </p>
        )
      }
    </div>
  );
}

class Conditions extends Component {

  state = {
    updating: this.props.updating || false
  }

  handleSave = key => data => {
    if (!this.props.editConditions) {
      return;
    }
    this.setState({ updating: true });
    const conditions = this.props.conditions.map(condition => {
      if (condition.key === key) {
        return {
          ...condition,
          ...data
        }
      }
      return condition;
    });
    return this.props.saveConditions(conditions)
      .then(() => this.setState({ updating: false }))
  }

  handleRemove = key => custom => {
    if (!this.props.editConditions) {
      return;
    }
    if (custom) {
      if (window.confirm('Are you sure?')) {
        this.setState({ updating: true })
        return this.props.saveConditions(this.props.conditions.filter(condition => condition.key !== key))
          .then(() => this.setState({ updating: false }))
      }
    } else {
      this.handleSave(key)({ deleted: true });
    }
  }

  render () {
    if (!this.props.showConditions) {
      return null;
    }
    const { conditions, editConditions } = this.props;
    const { updating } = this.state;

    return (
      <div className="conditions">
        {
          // ra conditions used to be added to the conditions array, we dont want to show them here.
          conditions.filter(c => !c.key.match(/^retrospective-assessment/)).map((condition, index) => {
            const template = get(CONDITIONS[this.props.scope], condition.path, {});
            const { title, content } = template;
            return <Condition
              key={condition.key}
              className={condition.key}
              singular={this.props.singular}
              editConditions={editConditions}
              updating={updating}
              title={title}
              number={index + 1}
              custom={condition.custom}
              content={content}
              {...condition}
              onSave={this.handleSave(condition.key)}
              onRemove={this.handleRemove(condition.key)}
            />
          })
        }
      </div>
    );
  }
}

const mapStateToProps = ({
  application: {
    showConditions,
    editConditions
  }
}, {
  conditions = []
}) => ({
  showConditions,
  editConditions,
  conditions
});

export default connect(mapStateToProps)(Conditions);
