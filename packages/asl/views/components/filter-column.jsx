const React = require('react');
const CheckboxGroup = require('govuk-react-components/components/forms/radio-group');
const MoreLink = require('./more-link');

class FilterColumn extends React.Component {
  componentDidMount() {
    this.setState({ showMore: false });
  }

  handleClickMore() {
    this.setState({
      showMore: !this.state.showMore
    });
  }

  render() {
    const {
      id,
      columnClass,
      currentFilters,
      handleOnChange,
      values,
      title,
      label
    } = this.props;

    const displayValues = this.state && !this.state.showMore && values.length > 4 ? values.slice(0, 4) : values;

    return (
      <div className={ columnClass }>
        <CheckboxGroup
          name={ id }
          type='checkbox'
          label={ title }
          options={ displayValues.map(value => ({ value, label: label ? label(value) : value })) }
          value={ currentFilters }
          onChange={ handleOnChange }
        />
        {
          !this.state ? null : values.length > 4 &&
          <MoreLink
            handleClick={ () => this.handleClickMore() }
            showing={ this.state && this.state.showMore }
          />
        }
      </div>
    );
  }
}

module.exports = FilterColumn;
