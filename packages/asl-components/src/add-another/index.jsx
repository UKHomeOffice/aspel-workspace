import React, { Component } from 'react';

class AddAnother extends Component {

    constructor(props) {
        super(props);
        this.addAnother = this.addAnother.bind(this);
    }

    componentDidMount() {
        const visible = Array(this.props.totalCount).fill(false);
        visible.fill(true, 0, this.props.visibleCount);
        this.setState({ visible });
    }

    addAnother(e) {
        e.preventDefault();
        const visible = [ ...this.state.visible ];
        visible[visible.lastIndexOf(true) + 1] = true;
        this.setState({ visible });
    }

    remove(e, index) {
        e.preventDefault();
        const visible = [ ...this.state.visible ];
        visible[index] = false;
        this.setState({ visible });
    }

    render() {
        const {
            children,
            labelAdd,
            labelRemove,
            totalCount
        } = this.props;
        const visible = (this.state && this.state.visible) || Array(totalCount).fill(false);

        return (
            <div className="add-another">
                { visible.map((isVisible, index) => {
                    const id = children.props.id ? `${children.props.id}-${index}` : undefined;
                    return isVisible &&
            <div key={index} className="govuk-grid-row add-another-item">
                <div className="govuk-grid-column-three-quarters">
                    { React.cloneElement(children, { id, key: index }) }
                </div>
                <div className="govuk-grid-column-one-quarter">
                    { index > 0 &&
                  <a href="#" className="add-another-remove" onClick={e => this.remove(e, index)}>{labelRemove || 'Remove'}</a>
                    }
                </div>
            </div>;
                })}
                <div>
                    <a href="#" className="add-another-add" onClick={e => this.addAnother(e)}>{labelAdd || 'Add'}</a>
                </div>
            </div>
        );
    }
}

export default AddAnother;
