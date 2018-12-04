import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { hideNotification } from './actions';
import { Snippet } from '../';

const NOTIFICATION_DURATION = 5000;
let notificationTimeout;

class Notification extends Component {

  componentDidMount() {
    this.timer = this.timer.bind(this);
    this.timer();
  }

  timer() {
    clearTimeout(notificationTimeout);
    if (this.props.timeout && this.props.message) {
      notificationTimeout = setTimeout(this.props.hideNotification, this.props.timeout);
    }
  }

  alert() {
    const { message, type, timeout, hideNotification, ...props } = this.props;
    if (!message) {
      return;
    }
    this.timer();
    return (
      <div
        className={`alert alert-${type}`}
        key="alert"
        onClick={() => {
          clearTimeout(notificationTimeout);
          hideNotification();
        }}>
        <div className="govuk-width-container">
          <p>
            {
              <Snippet fallback={message} {...props}>{`notifications.${message}`}</Snippet>
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

Notification.defaultProps = {
  timeout: NOTIFICATION_DURATION,
  type: 'alert'
};

const mapStateToProps = ({ notification }) => ({ ...notification });

export default connect(mapStateToProps, { hideNotification })(Notification);
