import React, { Component } from 'react';
import classnames from 'classnames';

class BackToTop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: this.props.isVisible || true
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    console.log('scrolll!');

    if (!this.props.isVisible && window.pageYOffset > this.props.showAt) {
      this.setState({ isVisible: true });
    } else if (this.props.isVisible && window.pageYOffset < this.props.showAt) {
      this.setState({ isVisible: false });
    }
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className={classnames('back-to-top', { hidden: !this.state.isVisible })} >
        <p><a href="#" onClick={() => this.scrollToTop()}>Back to top</a></p>
      </div>
    );
  }
}

BackToTop.defaultProps = {
  showAt: 400
};

export default BackToTop;
