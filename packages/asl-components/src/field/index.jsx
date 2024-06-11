import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextArea } from '@ukhomeoffice/react-components';
import { Markdown } from '../';

class Field extends Component {
    constructor (props) {
        super(props);

        const content = this.props.model
            ? this.props.model[this.props.name] || this.props.content
            : this.props.content;

        this.state = {
            editing: !!(this.props.model && this.props.model[this.props.name]),
            content
        };
        this.toggleEditing = this.toggleEditing.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    toggleEditing(e) {
        e.preventDefault();
        this.setState({
            editing: !this.state.editing
        });
    }

    onChange(e) {
        this.setState({ content: e.target.value });
    }

    render () {
        const { title, content, name } = this.props;
        return (
            <div className="field">
                <h2>{ title }</h2>
                <Markdown>{ content }</Markdown>
                {
                    this.props.editable && (!this.state || this.state.editing) && (
                        <TextArea
                            label=""
                            name={name}
                            value={this.state ? this.state.content : content}
                            onChange={this.onChange}
                        />
                    )
                }
                {
                    this.props.editable && this.state && <a href="#" onClick={this.toggleEditing}>{this.state.editing ? 'Cancel' : 'Edit'}</a>
                }
            </div>
        );
    }
}

const mapStateToProps = ({ model }) => ({ model });

export default connect(mapStateToProps)(Field);
