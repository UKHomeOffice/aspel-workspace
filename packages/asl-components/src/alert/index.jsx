import React from 'react';
import { connect } from 'react-redux';
import { hideMessage } from '../actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Alert extends React.Component {

  alert() {
    if (!this.props.message) {
      return;
    }
    return (
      <div
        className={`alert alert-${this.props.type}`}
        key="alert"
        onClick={this.props.hideMessage}
        >
        <div className="govuk-width-container">
          <p>{ this.props.message }</p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="alert"
        transitionEnterTimeout={100}
        transitionLeaveTimeout={500}
        >
        { this.alert() }
      </ReactCSSTransitionGroup>
    );
  }
}

const mapStateToProps = ({ notification: { message, type } }) => ({ message, type });

export default connect(mapStateToProps, { hideMessage })(Alert);
