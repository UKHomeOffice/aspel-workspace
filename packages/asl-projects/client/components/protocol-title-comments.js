import React from 'react';
import { connect } from 'react-redux';
import Comments from './comments';
import DiffWindow from './diff-window';
import ChangedBadge from './changed-badge';
import NewComments from './new-comments';
import ErrorBoundary from './error-boundary';

// Renders the comment and change display for a protocol title field in the
// read-only/playback "blue header". The title is shown elsewhere as the
// heading, so this only adds the NEW COMMENT flag, the CHANGED badge,
// "See what's changed" and the expandable "Show comments" panel - reusing the
// same primitives as every other PPL field (see ./review.js). It is purely
// additive: it does not alter how the title itself is rendered or edited.
const ProtocolTitleComments = ({
  field,
  title,
  readonly,
  newCommentCount,
  changedFromFirst,
  changedFromLatest,
  changedFromGranted
}) => {
  const changed = changedFromFirst || changedFromLatest || changedFromGranted;

  return (
    <div className="protocol-title-comments">
      {
        !!newCommentCount && <NewComments comments={newCommentCount} />
      }
      <ChangedBadge primaryField={field} fields={[field]} />
      {
        readonly && changed && (
          <DiffWindow
            name={field}
            label="Protocol title"
            value={title}
            type="text"
            changedFromFirst={changedFromFirst}
            changedFromLatest={changedFromLatest}
            changedFromGranted={changedFromGranted}
          />
        )
      }
      <Comments field={field} collapsed={!readonly} />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const field = `protocols.${ownProps.protocolId}.title`;
  const {
    application: { readonly = false } = {},
    changes: { first = [], latest = [], granted = [] } = {}
  } = state;

  return {
    field,
    readonly: ownProps.readonly || readonly,
    changedFromFirst: first.includes(field),
    changedFromLatest: latest.includes(field),
    changedFromGranted: granted.includes(field)
  };
};

const ConnectedProtocolTitleComments = connect(mapStateToProps)(ProtocolTitleComments);

const SafeProtocolTitleComments = props => (
  <ErrorBoundary details={`Protocol title comments: ${props.protocolId}`}>
    <ConnectedProtocolTitleComments {...props} />
  </ErrorBoundary>
);

export default SafeProtocolTitleComments;
