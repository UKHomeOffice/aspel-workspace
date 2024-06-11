import React, { Component, Fragment } from 'react';

class StatusBar extends Component {
    render() {
        const {
            user = {},
            logoutLink = '/logout',
            logoutLabel = 'Sign Out'
        } = this.props;
        return (
            <div className="status-bar">
                { user && user.profile && (
                    <Fragment>
                        <span><a href="/account">{`${user.profile.firstName} ${user.profile.lastName}`}</a></span>
            |
                    </Fragment>
                )}
                <span><a href={logoutLink}>{logoutLabel}</a></span>
            </div>
        );
    }
}

export default StatusBar;
