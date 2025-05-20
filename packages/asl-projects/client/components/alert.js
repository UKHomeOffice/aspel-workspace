import React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { hideMessage } from '../actions/messages';
import { Markdown } from '@ukhomeoffice/asl-components';

const mapStateToProps = state => {
  return { ...state.message };
};

class Create extends React.Component {

  onClick = () => {
    this.props.hideMessage();
  }

  alert() {
    if (!this.props.message) {
      return null;
    }
    return (
      <CSSTransition
        key="alert"
        classNames="alert"
        timeout={{ enter: 100, exit: 500 }}
      >
        <div className={`alert alert-${this.props.type}`} onClick={this.onClick}>
          <div className="govuk-width-container">
            <Markdown>{ this.props.message }</Markdown>
          </div>
        </div>
      </CSSTransition>
    );
  }

  render() {
    return (
      <TransitionGroup>
        { this.alert() }
      </TransitionGroup>
    );
  }

}

export default connect(mapStateToProps, { hideMessage })(Create);
