import React, { Component } from 'react';
import classnames from 'classnames';

class ExpandingPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.isOpen || false, // Initialize state based on props
        };
    }

    controlled() {
        return typeof this.props.open === 'boolean';
    }

    toggle() {
        if (this.controlled()) {
            return this.props.onToggle();
        }
        this.setState((prevState) => ({ open: !prevState.open }));
    }

    isOpen() {
        if (this.controlled()) {
            return this.props.open;
        }
        return this.state.open;
    }

    render() {
        const { wrapTitle = true, title, children } = this.props;

        return (
            <section className={`expanding-panel${this.isOpen() ? ' open' : ''}`}>
                <header onClick={() => this.toggle()}>
                    {wrapTitle ? <h3>{title}</h3> : title}
                </header>
                {this.isOpen() && (
                    <div className={classnames('content', { hidden: !this.isOpen() })}>
                        {children}
                    </div>
                )}
            </section>
        );
    }
}

export default ExpandingPanel;
