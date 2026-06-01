import React, { Fragment, useState } from 'react';
import { FEATURE_FLAG_STANDARD_PROTOCOLS, useFeatureFlag } from '@asl/service/ui/feature-flag';
import conditions from '../../../constants/protocol-conditions';
import { Details, Markdown } from '@ukhomeoffice/asl-components';

function Content({ copy }) {
  return (
    <Fragment>
      <div className="purple-inset condition-text">
        <Markdown>{copy.anaesthesia}</Markdown>
      </div>
      <div className="purple-inset condition-text">
        <Markdown>{copy.generalAnaesthesia}</Markdown>
      </div>
      <div className="purple-inset condition-text">
        <Markdown>{copy.surgery}</Markdown>
      </div>
      <div className="purple-inset condition-text">
        <Markdown>{copy.administration}</Markdown>
      </div>
    </Fragment>
  );
}

export default function ProtocolConditions({ pdf }) {
  const standardProtocolsEnabled = useFeatureFlag(FEATURE_FLAG_STANDARD_PROTOCOLS);
  const copy = standardProtocolsEnabled ? conditions.variants.standardProtocol : conditions.variants.default;

  const [isOpen, setIsOpen] = useState(Boolean(standardProtocolsEnabled));


  if (pdf) {
    return (
      <div className="protocol-conditions">
        <h2>{copy.title}</h2>
        <p>{copy.summary}</p>
        <Content copy={copy} />
      </div>
    );
  }

  return (
    <div className="protocol-conditions">
      <h2 id={standardProtocolsEnabled ? 'general-constraints' : undefined}>{copy.title}</h2>

      <p>{copy.summary}</p>

      {
        standardProtocolsEnabled
          ? (
            <details open={isOpen} onToggle={e => setIsOpen(e.target.open)}>
              <summary id="general-constraints">{`${isOpen ? 'Hide' : 'Show'} general constraints`}</summary>
              <Content copy={copy} />
            </details>
          )
          : (
            <Details summary="Show general constraints">
              <Content copy={copy} />
            </Details>
          )
      }
    </div>
  );
}
