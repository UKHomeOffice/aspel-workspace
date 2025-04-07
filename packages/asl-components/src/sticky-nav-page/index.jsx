import React, { Component } from 'react';
import { StickyNav } from '../';

import reduce from 'lodash/reduce';

class StickyNavPage extends Component {
    constructor(props) {
        super(props);
        this.sections = React.Children.toArray(this.props.children).filter(Boolean).reduce((refs, child) => {
            return {
                ...refs,
                [child.props.id]: React.createRef()
            };
        }, {});
        this.state = {
            active: null
        };
        this.linkClicked = this.linkClicked.bind(this);
        this.thresholds = {};
        this.onScroll = this.onScroll.bind(this);
    }

    componentDidUpdate() {
        this.thresholds = reduce(this.sections, (obj, element, name) => {
            return { ...obj, [element.current.offsetTop]: name };
        }, {});
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll);
    }

    onScroll() {
        const thresholds = Object.keys(this.thresholds);
        const scrollTop = document.documentElement.scrollTop;
        const section = thresholds.find((t, index) => {
            const lowerLimit = thresholds[index - 1] ? parseInt(thresholds[index - 1], 10) : 0;
            const upperLimit = thresholds[index + 1] ? parseInt(thresholds[index + 1], 10) : Infinity;
            return scrollTop >= lowerLimit && scrollTop < upperLimit;
        });
        this.setState({ active: this.thresholds[section] });
    }

    linkClicked(e, section) {
        e.preventDefault();
        this.setState({ active: section }, () => this.scrollTo(section));
    }

    scrollTo(section) {
        clearTimeout(this.timeout);
        window.removeEventListener('scroll', this.onScroll);

        window.scrollTo({
            top: this.sections[section].current.offsetTop,
            behavior: 'smooth'
        });

        // wait until animation finished then reattach scroll handler
        this.timeout = setTimeout(() => {
            window.addEventListener('scroll', this.onScroll);
        }, 500);
    }

    render() {
        return (
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-third">
                    <StickyNav
                        active={this.state.active}
                        sections={React.Children.toArray(this.props.children).filter(Boolean).map(child => child.props.id)}
                        linkClicked={this.linkClicked}
                    />
          &nbsp;
                </div>
                <div className="govuk-grid-column-two-thirds">
                    {
                        React.Children.map(this.props.children, child =>
                            child && React.cloneElement(child, { ref: this.sections[child.props.id] })
                        )
                    }
                </div>
            </div>
        );
    }
}

export default StickyNavPage;
