const React = require('react');
const Layout = require('./layout');

const Input = require('govuk-react-components/components/forms/input-text');
const RadioGroup = require('govuk-react-components/components/forms/radio-group');
const Select = require('govuk-react-components/components/forms/select');
const Date = require('govuk-react-components/components/forms/date');

class Index extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <h1 className="heading-large">React Component Examples</h1>
        <form action="" method="post">
          <Input
            name="name"
            label="First name"
            hint="Some additional information"
            error="Oh no! You broke it!"
            value="HELLO!"
            />
          <RadioGroup
            name="number"
            label="Pick a number"
            options={[
              { label: 'One', value: 1 },
              { label: 'Two', value: 2 }
            ]}
            value={1}
            hint="Some additional information"
            error="Oh no! You broke it!"
            />
          <RadioGroup
            name="numbers"
            type="checkbox"
            label="Pick some numbers"
            options={[
              { label: 'One', value: 1 },
              { label: 'Two', value: 2 },
              { label: 'Three', value: 3 }
            ]}
            value={[1,3]}
            hint="Some additional information"
            error="Oh no! You broke it!"
            />
          <Select
            name="number-select"
            label="Pick a number"
            options={[
              { label: 'One', value: 1 },
              { label: 'Two', value: 2 }
            ]}
            value={1}
            hint="Some additional information"
            error="Oh no! You broke it!"
            />
          <Date
            name="date"
            label="Enter a date"
            value="2018-01-31"
            hint="Some additional information"
            error="Oh no! You broke it!"
            />
        </form>
      </Layout>
    );
  }
}

module.exports = Index;