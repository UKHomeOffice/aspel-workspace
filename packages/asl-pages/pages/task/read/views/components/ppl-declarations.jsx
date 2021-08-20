import React, { Fragment } from 'react';
import get from 'lodash/get';
import upperFirst from 'lodash/upperFirst';
import { Markdown, Snippet } from '@asl/components';
import format from 'date-fns/format';
import { dateFormat } from '../../../../../constants';

export default function PplDeclarations({ task }) {
  if (task.data.model !== 'project') {
    return null;
  }

  const status = task.status;
  const isAmendment = task.type === 'amendment';
  const receivingEstablishmentId = get(task, 'data.action') === 'transfer' && get(task, 'data.data.establishmentId');

  // prefer the payload for declarations if available as it reflects the status at the time the task was actioned
  const declarations = get(task, 'meta.payload.meta') || get(task, 'data.meta') || {};

  if (!declarations.authority && status === 'endorsed') {
    declarations.authority = 'Yes';
    // endorsed action needs to display ready status but does not submit it in payload
    declarations.ready = get(task, 'data.meta.ready');
  }

  const legacyAwerbReviewDate = declarations['awerb-review-date'];
  const displayAwerb = !legacyAwerbReviewDate && declarations['awerb-exempt'] !== 'yes';

  const primaryAwerb = displayAwerb && declarations['awerb-dates'] && declarations['awerb-dates'].filter(awerb => awerb.primary)[0];
  const aaAwerbs = (displayAwerb && (declarations['awerb-dates'] && declarations['awerb-dates'].filter(awerb => !awerb.primary && awerb.id !== receivingEstablishmentId))) || [];
  const receivingAwerb = displayAwerb && receivingEstablishmentId && declarations['awerb-dates'] && declarations['awerb-dates'].filter(awerb => awerb.id === receivingEstablishmentId)[0];

  return (
    <div className="declarations">
      {
        declarations.authority &&
          <dl className="inline-wide">
            <dt><Snippet>declarations.pel-holder.question</Snippet></dt>
            <dd>{declarations.authority}</dd>
          </dl>
      }

      {
        isAmendment
          ? <dl className="inline-wide">
            <dt><Snippet>declarations.awerb.question</Snippet></dt>
            <dd>{upperFirst(declarations.awerb)}</dd>
          </dl>
          : <dl className="inline-wide">
            <dt><Snippet>declarations.ready-for-inspector.question</Snippet></dt>
            <dd>{declarations.ready || 'No'}</dd>
          </dl>
      }
      {
        legacyAwerbReviewDate &&
          <dl className="inline-wide">
            <dt><Snippet>declarations.awerb.review-date</Snippet></dt>
            <dd>{declarations['awerb-review-date']}</dd>
          </dl>
      }
      {
        primaryAwerb &&
          <dl className="inline-wide">
            <dt>
              {
                (receivingAwerb || aaAwerbs.length)
                  ? `${primaryAwerb.name} AWERB review date:`
                  : 'AWERB review date:'
              }
            </dt>
            <dd>{format(primaryAwerb.date, dateFormat.long)}</dd>
          </dl>
      }
      {
        receivingAwerb &&
          <dl className="inline-wide">
            <dt>{receivingAwerb.name} AWERB review date:</dt>
            <dd>{format(receivingAwerb.date, dateFormat.long)}</dd>
          </dl>
      }
      {
        aaAwerbs.length > 0 &&
          <Fragment>
            <dl className="inline-wide">
              <dt>Additonal availability at:</dt>
              <dd>{ aaAwerbs.map(awerb => <span key={awerb.id} className="aa-establishment">{awerb.name}</span>) }</dd>
            </dl>
            <dl className="inline-wide">
              {
                aaAwerbs.map(awerb => (
                  <Fragment key={awerb.id}>
                    <dt>{awerb.name} AWERB review date:</dt>
                    <dd>{format(awerb.date, dateFormat.long)}</dd>
                  </Fragment>
                ))
              }
            </dl>
          </Fragment>
      }
      {
        ((declarations.awerb || '').toLowerCase() === 'no' || declarations['awerb-exempt'] === 'yes') &&
          <Fragment>
            <p><strong><Snippet>declarations.awerb.no-review-reason</Snippet></strong></p>
            <Markdown>{declarations['awerb-no-review-reason']}</Markdown>
          </Fragment>
      }
    </div>
  );
}
