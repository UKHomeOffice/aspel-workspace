import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { hideNotification } from './actions';

const NOTIFICATION_DURATION = 5000;

const Notification = ({ timeout = NOTIFICATION_DURATION, type = 'alert', message, hideNotification }) => {
    const timer = useCallback(() => {
        if (timeout && message) {
            const timeoutId = setTimeout(hideNotification, timeout);
            return () => clearTimeout(timeoutId);
        }
    }, [timeout, message, hideNotification]);

    useEffect(() => {
        const cleanup = timer();
        return cleanup;
    }, [timer]);

    if (!message) {
        return null;
    }

    return (
        <div
            className={`alert alert-${type}`}
            key="alert"
            onClick={() => {
                hideNotification();
            }}>
            <div className="govuk-width-container">
                <p>{message}</p>
            </div>
        </div>
    );
};

const mapStateToProps = ({ notification }) => ({ ...notification });

export default connect(mapStateToProps, { hideNotification })(Notification);
