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
// "See what's changed" and (when comments already exist) the "Show comments"
// panel - reusing the same primitives as every other PPL field (see
// ./review.js). The "See what's changed" link is suppressed when the whole
// protocol is newly added, and the comments panel is display-only (no
// empty-state "Add comment" box). It is purely additive: it does not alter
// how the title itself is rendered or edited.
const ProtocolTitleComments = ({
  field,
  prefix,
  protocolId,
  previousProtocols,
  title,
  readonly,
  newCommentCount,
  hasComments,
  changedFromFirst,
  changedFromLatest,
  changedFromGranted,
  parentAddedFromFirst,
  parentAddedFromLatest,
  parentAddedFromGranted
}) => {
  // Match review.js: the "See what's changed" link is hidden when the change
  // is only there because the whole protocol was added (nothing to diff
  // against), but DiffWindow still receives the raw changedFrom* flags so its
  // version tabs are identical to every other field.
  const changed = (changedFromFirst && !parentAddedFromFirst)
    || (changedFromLatest && !parentAddedFromLatest)
    || (changedFromGranted && !parentAddedFromGranted);

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
            prefix={prefix}
            fieldName="title"
            protocolId={protocolId}
            previousProtocols={previousProtocols}
            label="Protocol title"
            value={title}
            type="text"
            readonly={readonly}
            changedFromFirst={changedFromFirst}
            changedFromLatest={changedFromLatest}
            changedFromGranted={changedFromGranted}
          />
        )
      }
      {
        // Display-only: show the comments panel only when a comment already
        // exists on the title. Titles are not a place to start a new thread,
        // so we deliberately omit the empty-state "Add comment" box.
        hasComments && <Comments field={field} collapsed={!readonly} />
      }
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const prefix = `protocols.${ownProps.protocolId}.`;
  const field = `${prefix}title`;
  const protocolKey = `protocols.${ownProps.protocolId}`;
  const {
    application: { readonly = false, previousProtocols = {} } = {},
    changes: { first = [], latest = [], granted = [] } = {},
    added: { first: firstAdded = [], latest: latestAdded = [], granted: grantedAdded = [] } = {},
    comments = {}
  } = state;

  // Raw change/added flags, kept separate exactly as review.js does: the
  // changedFrom* flags drive DiffWindow's version comparison (so the modal,
  // tabs and highlighting are identical to other fields), while the
  // parentAdded* flags are used only to decide whether to offer the diff at
  // all - a title on a freshly added protocol has no prior version to compare.
  return {
    field,
    prefix,
    previousProtocols,
    readonly: ownProps.readonly || readonly,
    hasComments: (comments[field] || []).length > 0,
    changedFromFirst: first.includes(field),
    changedFromLatest: latest.includes(field),
    changedFromGranted: granted.includes(field),
    parentAddedFromFirst: firstAdded.includes(protocolKey),
    parentAddedFromLatest: latestAdded.includes(protocolKey),
    parentAddedFromGranted: grantedAdded.includes(protocolKey)
  };
};

const ConnectedProtocolTitleComments = connect(mapStateToProps)(ProtocolTitleComments);

const SafeProtocolTitleComments = props => (
  <ErrorBoundary details={`Protocol title comments: ${props.protocolId}`}>
    <ConnectedProtocolTitleComments {...props} />
  </ErrorBoundary>
);

export default SafeProtocolTitleComments;
