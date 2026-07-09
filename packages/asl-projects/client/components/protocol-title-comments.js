import React from 'react';
import { connect } from 'react-redux';
import Comments from './comments';
import DiffWindow from './diff-window';
import ChangedBadge from './changed-badge';
import NewComments from './new-comments';
import ErrorBoundary from './error-boundary';
import { isTitleChanged } from '../helpers/protocol-title-change-detection';

const ProtocolTitleComments = ({
  field,
  prefix,
  protocolId,
  previousProtocols,
  title,
  readonly,
  newCommentCount,
  changedFromFirst,
  changedFromLatest,
  changedFromGranted,
  parentAddedFromFirst,
  parentAddedFromLatest,
  parentAddedFromGranted
}) => {

  const changed = isTitleChanged({
    changedFromFirst,
    changedFromLatest,
    changedFromGranted,
    parentAddedFromFirst,
    parentAddedFromLatest,
    parentAddedFromGranted
  });

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
        <Comments field={field} collapsed={!readonly} />
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
    added: { first: firstAdded = [], latest: latestAdded = [], granted: grantedAdded = [] } = {}
  } = state;

  return {
    field,
    prefix,
    previousProtocols,
    readonly: ownProps.readonly || readonly,
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
