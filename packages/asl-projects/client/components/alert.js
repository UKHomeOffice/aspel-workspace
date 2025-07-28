import React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { hideMessage } from '../actions/messages';
import { Markdown } from '@ukhomeoffice/asl-components';

const mapStateToProps = state => {
  return {
    message: state.message.message,
    type: state.message.type,
    // Add a flag to check if save was successful
    lastAction: state.lastAction
  };
};

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.nodeRef = React.createRef();
  }

  onClick = () => {
    this.props.hideMessage();
  };

  // Add componentDidUpdate to auto-hide success messages
  componentDidUpdate(prevProps) {
    if (this.props.lastAction === 'SAVE_SUCCESS' &&
      prevProps.lastAction !== this.props.lastAction) {
      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.props.hideMessage();
      }, 3000);
    }
  }

  alert() {
    if (!this.props.message) {
      return null;
    }

    return (
      <CSSTransition
        key={this.props.message} // Use message as key to force re-render
        classNames="alert"
        timeout={{ enter: 100, exit: 500 }}
        nodeRef={this.nodeRef}
        onExited={this.props.hideMessage} // Ensure clean state after animation
      >
        <div
          ref={this.nodeRef}
          className={`alert alert-${this.props.type}`}
          onClick={this.onClick}
          role="alert" // Accessibility improvement
        >
          <div className="govuk-width-container">
            <Markdown>{this.props.message}</Markdown>
          </div>
        </div>
      </CSSTransition>
    );
  }

  render() {
    return (
      <TransitionGroup component={null}> {/* component={null} prevents wrapper div */}
        {this.alert()}
      </TransitionGroup>
    );
  }
}

export default connect(mapStateToProps, { hideMessage })(Create);
