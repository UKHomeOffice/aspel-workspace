import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { Snippet } from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';

class ToggleASRU extends React.Component {

  renderAdd() {
    return <Fragment>
      <h3><Snippet>asru.add</Snippet></h3>
      <form action="" method="post">
        <input type="hidden" name="asruUser" value="true" />
        <Button type="submit" className="button-secondary"><Snippet>asru.add</Snippet></Button>
      </form>
    </Fragment>;
  }

  renderRemove() {
    return <Fragment>
      <hr />
      <h3><Snippet>asru.remove</Snippet></h3>
      <form action="" method="post">
        <input type="hidden" name="asruUser" value="false" />
        <Button type="submit" className="button-secondary"><Snippet>asru.remove</Snippet></Button>
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
