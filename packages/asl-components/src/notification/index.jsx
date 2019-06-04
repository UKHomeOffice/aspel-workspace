import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideNotification } from './actions';

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

  render() {
    const { message, type, timeout, hideNotification, ...props } = this.props;
    if (!message) {
      return null;
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
          <p>{ message }</p>
        </div>
      </div>
    );
  }
}

Notification.defaultProps = {
  timeout: NOTIFICATION_DURATION,
  type: 'alert'
};

const mapStateToProps = ({ notification }) => ({ ...notification });

export default connect(mapStateToProps, { hideNotification })(Notification);
