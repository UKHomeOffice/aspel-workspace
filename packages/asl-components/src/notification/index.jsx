import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideNotification } from './actions';

const NOTIFICATION_DURATION = 5000;

class Notification extends Component {

    componentDidMount() {
        this.timer = this.timer.bind(this);
        this.timer();
    }

    timer() {
        clearTimeout(this.timeout);
        if (this.props.timeout && this.props.message) {
            this.timeout = setTimeout(this.props.hideNotification, this.props.timeout);
        }
    }

    render() {
        const { message, type, hideNotification } = this.props;
        if (!message) {
            return null;
        }
        this.timer();
        return (
            <div
                className={`alert alert-${type}`}
                key="alert"
                onClick={() => {
                    clearTimeout(this.timeout);
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
