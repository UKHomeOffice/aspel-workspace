import React, { Component } from 'react';
import classnames from 'classnames';

class ExpandingPanel extends Component {

  componentDidMount() {
    this.setState({ open: this.props.isOpen });
  }

  controlled() {
    return typeof this.props.open === 'boolean';
  }

  toggle () {
    if (this.controlled()) {
      return this.props.onToggle();
    }
    return this.setState({ open: !this.state.open });
  }

  isOpen() {
    if (this.controlled()) {
      return this.props.open;
    }
    return !this.state || this.state.open;
  }

  render() {
    return (
      <section className={`expanding-panel${this.isOpen() ? ' open' : ''}`}>
        <header onClick={() => this.toggle()}>
          {
            this.props.wrapTitle ? <h3>{ this.props.title }</h3> : this.props.title
          }
        </header>
        <div className={classnames('content', { hidden: !this.isOpen() })}>{ this.props.children }</div>
      </section>
    );
  }
}

ExpandingPanel.defaultProps = {
  wrapTitle: true
};

export default ExpandingPanel;
