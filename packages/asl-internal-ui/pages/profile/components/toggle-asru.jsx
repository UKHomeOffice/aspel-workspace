import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { Button } from '@ukhomeoffice/react-components';

class ToggleASRU extends React.Component {

  renderAdd() {
    return <Fragment>
      <h3>Add to ASRU</h3>
      <form action="" method="post">
        <input type="hidden" name="asruUser" value="true" />
        <Button type="submit" className="button-secondary">Add to ASRU</Button>
      </form>
    </Fragment>;
  }

  renderRemove() {
    return <Fragment>
      <h3>Remove from ASRU</h3>
      <form action="" method="post">
        <input type="hidden" name="asruUser" value="false" />
        <Button type="submit" className="button-secondary">Remove from ASRU</Button>
      </form>
    </Fragment>;
  }

  render () {
    const model = this.props.model;

    return model.asruUser ? this.renderRemove() : this.renderAdd();
  }

}

const mapStateToProps = ({ model }) => ({ model });

export default connect(mapStateToProps)(ToggleASRU);
