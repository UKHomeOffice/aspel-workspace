import React from 'react';
import { Button } from '@ukhomeoffice/react-components';

class WarningButton extends React.Component {
  static defaultProps = {
    warning: 'Are you sure?'
  };

  warn (e) {
    e.preventDefault();
    this.setState({ warning: true });
  }

  render() {
    if (this.state && this.state.warning) {
      return <Button { ...this.props }>{this.props.warning}</Button>;
    }
    return <Button { ...this.props } onClick={e => this.warn(e)} />;
  }

}

export default WarningButton;
