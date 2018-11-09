import React from 'react';
import { connect } from 'react-redux';
import { Snippet } from '../';

const Notifications = ({
  notifications
}) => {
  if (!notifications || !notifications.length) {
    return null;
  }
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <div className="notification-summary" role="alert" aria-labelledby="notification-summary-heading" tabIndex="-1">
          <h2 className="govuk-heading-m notification-summary-heading" id="notification-summary-heading">
            {
              notifications.map(({ type, props }, index) =>
                <Snippet key={index} { ...props }>{`notifications.${type}`}</Snippet>
              )
            }
          </h2>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ static: { notifications } }) => {
  return { notifications };
};

export default connect(mapStateToProps)(Notifications);
