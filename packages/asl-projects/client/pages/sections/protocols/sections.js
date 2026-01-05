import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import size from 'lodash/size';
import flatten from 'lodash/flatten';
import lowerFirst from 'lodash/lowerFirst';
import Accordion from '../../../components/accordion';
import ExpandingPanel from '../../../components/expanding-panel';
import NewComments from '../../../components/new-comments';
import { flattenReveals } from '../../../helpers';
import Section from './section';
import Steps from './steps';
import Animals from './animals';
import LegacyAnimals from './legacy-animals';
import Conditions from '../../../components/conditions/protocol-conditions';
import ChangedBadge from '../../../components/changed-badge';
import { reusableStepFieldKeys } from '../../../helpers/steps';
import { normaliseValue } from '../../../helpers/normalisation';

// Helper to determine protocol type
const getProtocolType = (protocol) => {
  // Priority 1: Explicit type
  if (protocol?.protocolType) {
    return protocol.protocolType;
  }

  // Priority 2: Standard protocol markers
  if (protocol?._isStandardProtocol || protocol?._sourceTemplate || protocol?._templateSource) {
    return 'standard';
  }

  // Priority 3: Default to experimental
  return 'experimental';
};

const getSection = (section, props) => {
  const isFullApplicationPdf = props.isFullApplication && props.pdf;

  if (props.isGranted && props.granted && props.granted.review && !isFullApplicationPdf) {
    return <props.granted.review {...props} />;
  }

  switch (section) {
    case 'steps':
      return props.schemaVersion === 0
        ? <Section {...props} />
        : <Steps {...props} />;
    case 'animals':
      return <Animals {...props} />;
    case 'legacy-animals':
      return <LegacyAnimals {...props} />;
    case 'conditions':
      return <Conditions
        {...props}
        type='condition'
        conditions={props.values.conditions}
      />;
    case 'authorisations':
      return <Conditions
        {...props}
        type='authorisation'
        conditions={props.values.conditions}
      />;
    default:
      return <Section {...props} />;
  }
};

const getFields = fields => {
  return flatten((fields || []).map(field => {
    const reveals = field.options && field.options.map(opt => opt.reveal).filter(Boolean);
    if (!reveals) {
      return field;
    }
    return [field, ...flatten(reveals)];
  }));
};

const getOpenSection = (protocolState, editable, sections, isStandardProtocol) => {
  // Standard protocols should not auto-open sections
  if (!editable || isStandardProtocol) {
    return null;
  }

  if (!protocolState) {
    return 0;
  }

  const { fieldName } = protocolState;

  return Object.values(sections).findIndex(section => {
    return getFields(section.fields).map(field => field.name).includes(fieldName);
  });
};

const getFieldKeys = (section, values) => {
  if (section.repeats) {
    const additionalReusableStepKeys = section.repeats === 'steps' ? reusableStepFieldKeys(values) : [];
    return [`protocols.${values.id}.${section.repeats}`, ...additionalReusableStepKeys];
  }

  const flattenedFields = flattenReveals(section.fields || [], values);

  if (section.repeats) {
    return (values[section.repeats] || []).filter(Boolean).reduce((list, repeater) => {
      return list.concat(flattenedFields.map(f => `protocols.${values.id}.${section.repeats}.${repeater.id}.${f.name}`));
    }, []);
  }

  return flattenedFields.map(f => `protocols.${values.id}.${f.name}`);
};

const getBadges = (section, newComments, values, project, protocolType) => {
  let relevantComments;

  if (section.repeats) {
    const re = new RegExp(`^${section.repeats}\\.`);
    relevantComments = section.title !== 'Steps'
      ? pickBy(newComments, (value, key) => key.match(re))
      : pickBy(newComments, (value, key) => key.match(re) || key.match('^reusableSteps\\.'));
  } else {
    relevantComments = pick(newComments, flattenReveals(section.fields, values).map(field => field.name));
  }

  const numberOfNewComments = Object.values(relevantComments).reduce((total, comments) => total + (comments || []).length, 0);
  const fields = getFieldKeys(section, values);

  const fieldsWithValues = [];

  section.fields?.forEach((field, index) => {
    const rawValue = field.name.includes('.')
      ? field.name.split('.').reduce((acc, key) => acc?.[key], values)
      : values?.[field.name];

    let fieldValue;
    if (typeof rawValue === 'object' && rawValue !== null) {
      if (Array.isArray(rawValue)) {
        fieldValue = rawValue.join(', ');
      } else {
        fieldValue = normaliseValue(rawValue);
      }
    } else {
      fieldValue = rawValue || null;
    }

    if (fieldValue) {
      fieldsWithValues.push({
        name: field.name,
        label: field.label,
        type: field.type,
        value: fieldValue
      });
    }
  });

  return (
    <Fragment>
      {!!numberOfNewComments && <NewComments comments={numberOfNewComments} />}

      {/* Show protocol type badge for non-experimental */}
      {protocolType && protocolType !== 'experimental' && (
        <span className={`protocol-type-badge ${protocolType}`}>
          {protocolType === 'standard' ? 'Standard Protocol' : 'Editable Template'}
        </span>
      )}

      {fieldsWithValues.length > 0 && (
        <ChangedBadge fields={fields} protocolId={values.id} />
      )}
    </Fragment>
  );
};

function Title({ section, newComments, values, number, pdf, protocolType }) {
  const title = pdf
    ? section.title
    : `Protocol ${number + 1}: ${section.title}`;

  return (
    <Fragment>
      {section.fields && getBadges(section, newComments, values, null, protocolType)}
      <div>{title}</div>
    </Fragment>
  );
}

const sortGranted = sections => (a, b) => {
  return sections[a].granted.order - sections[b].granted.order;
};

const ProtocolSections = ({ sections, protocolState, editable, newComments, ...props }) => {
  const { values } = props;

  // Determine protocol type and editability
  const protocolType = getProtocolType(values);
  const isStandardProtocol = protocolType === 'standard';
  const isProtocolEditable = editable && !isStandardProtocol;

  let sectionNames = Object.keys(sections)
    .filter(section => !sections[section].show || sections[section].show(props));

  if (props.isGranted && !props.isFullApplication && props.schemaVersion > 0) {
    sectionNames = sectionNames.sort(sortGranted(sections));
  }

  return (
    <div className={`playback ${isStandardProtocol ? 'standard-protocol' : ''}`}>
      <Accordion
        open={getOpenSection(protocolState, isProtocolEditable, sections, isStandardProtocol)}
        toggleAll={!props.pdf && isProtocolEditable}
        pdf={props.pdf}
      >
        {sectionNames.map((section, sectionIndex) => {
          const sectionProps = {
            ...props,
            protocolState,
            editable: isProtocolEditable,
            isReadOnly: isStandardProtocol, // Pass read-only flag to child components
            protocolType: protocolType,
            ...sections[section],
            sectionsLength: size(sections),
            sectionIndex,
            newComments
          };

          return (
            <ExpandingPanel
              key={section}
              title={<Title {...sectionProps} section={sections[section]} newComments={newComments} protocolType={protocolType} />}
              className={`${section.toLowerCase()} ${isStandardProtocol ? 'read-only' : ''}`}
              closeLabel={`Close ${lowerFirst(sections[section].title)}`}
              pdf={props.pdf}
              collapsible={!isStandardProtocol} // Disable collapsing for standard protocols
            >
              {getSection(section, sectionProps)}
            </ExpandingPanel>
          );
        })}
      </Accordion>
    </div>
  );
};

const mapStateToProps = ({
                           application: {
                             schemaVersion,
                             showConditions,
                             isGranted,
                             isFullApplication
                           },
                           project
                         }, { sections }) => ({
  schemaVersion,
  showConditions,
  isGranted,
  isFullApplication,
  project,
  // show all sections for legacy
  sections: isGranted && !isFullApplication && schemaVersion !== 0
    ? pickBy(sections, section => section.granted)
    : sections
});

export default connect(mapStateToProps)(ProtocolSections);
