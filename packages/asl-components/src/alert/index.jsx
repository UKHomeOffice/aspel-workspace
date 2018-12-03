import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { hideNotification } from './actions';
import { Snippet } from '../';

const NOTIFICATION_DURATION = 5000;
let notificationTimeout;

class Alert extends Component {

  componentDidMount() {
    this.timer = this.timer.bind(this);
    this.timer();
  }

  timer() {
    if (this.props.timeout && this.props.message) {
      notificationTimeout = setTimeout(this.props.hideNotification, this.props.timeout);
    }
  }

  alert() {
    if (!this.props.message) {
      return;
    }
    this.timer();
    return (
      <div
        className={`alert alert-${this.props.type}`}
        key="alert"
        onClick={() => {
          clearTimeout(notificationTimeout);
          this.props.hideNotification();
        }}>
        <div className="govuk-width-container">
          <p>
            {
              <Snippet fallback={this.props.message}>{`notification.${this.props.message}`}</Snippet>
            }
          </p>
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

Alert.defaultProps = {
  timeout: NOTIFICATION_DURATION,
  type: 'alert'
};

const mapStateToProps = ({ notification: { message, type, timeout } }) => ({ message, type, timeout });

export default connect(mapStateToProps, { hideNotification })(Alert);
