import React, { Component } from 'react';
import classnames from 'classnames';
import { Snippet } from '../';

class StickyNav extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.onscroll = this.onscroll.bind(this);
  }

  componentDidMount() {
    this.offsetTop = this.ref.current.offsetTop;
    this.width = this.ref.current.offsetWidth;
    this.onscroll();
    window.addEventListener('scroll', this.onscroll);
  }

  onscroll() {
    const el = this.ref.current;
    const scrollPos = document.documentElement.scrollTop;
    if (scrollPos > this.offsetTop) {
      el.style.position = 'fixed';
      el.style.top = 0;
      el.style.width = `${this.width}px`;
    } else {
      el.style.position = 'static';
    }
  }

  render() {
    const { sections, active, linkClicked } = this.props;
    return (
      <nav ref={this.ref} className="sticky-nav">
        {
          sections.map((section, index) => (
            <a
              key={index}
              href={`#${section}`}
              onClick={e => linkClicked(e, section)}
              className={classnames({ active: !active ? index === 0 : active === section })}
            ><Snippet>{`sticky-nav.${section}`}</Snippet></a>
          ))
        }
      </nav>
    );
  }
}

export default StickyNav;
