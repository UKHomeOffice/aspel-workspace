import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import size from 'lodash/size';
import flatten from 'lodash/flatten';

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

const getSection = (section, props) => {
  const isFullApplicationPdf = props.isFullApplication && props.pdf;
  if (props.isGranted && props.granted && props.granted.review && !isFullApplicationPdf) {
    return <props.granted.review {...props} />
  }
  switch(section) {
    case 'steps':
      return props.schemaVersion === 0
        ? <Section {...props} />
        : <Steps {...props} />
    case 'animals':
      return <Animals {...props} />
    case 'legacy-animals':
      return <LegacyAnimals {...props} />
    case 'conditions':
      return <Conditions
        {...props}
        type='condition'
        conditions={props.values.conditions}
      />
    case 'authorisations':
      return <Conditions
        {...props}
        type='authorisation'
        conditions={props.values.conditions}
      />
    default:
      return <Section {...props} />
  }
}

const getFields = fields => {
  return flatten((fields || []).map(field => {
    const reveals = field.options && field.options.map(opt => opt.reveal).filter(Boolean);
    if (!reveals) {
      return field
    }
    return [field, ...flatten(reveals)];
  }));
};

const getOpenSection = (protocolState, editable, sections) => {
  if (!editable) {
    return null;
  }

  if (!protocolState) {
    return 0;
  }

  const { fieldName } = protocolState;

  return Object.values(sections).findIndex(section => {
    return getFields(section.fields).map(field => field.name).includes(fieldName);
  });
}

const getFieldKeys = (section, values) => {
  const flattenedFields = flattenReveals(section.fields || [], values);
  if (section.repeats) {
    return (values[section.repeats] || []).filter(Boolean).reduce((list, repeater) => {
      return list.concat(flattenedFields.map(f => `protocols.${values.id}.${section.repeats}.${repeater.id}.${f.name}`));
    }, []);
  }
  return flattenedFields.map(f => `protocols.${values.id}.${f.name}`);
};

const getBadges = (section, newComments, values) => {
  let relevantComments;
  if (section.repeats) {
    const re = new RegExp(`^${section.repeats}\\.`);
    relevantComments = pickBy(newComments, (value, key) => key.match(re))
  } else {
    relevantComments = pick(newComments, flattenReveals(section.fields, values).map(field => field.name))
  }
  const numberOfNewComments = Object.values(relevantComments).reduce((total, comments) => total + (comments || []).length, 0);

  const fields = getFieldKeys(section, values);

  return (
    <Fragment>
      {
        !!numberOfNewComments && <NewComments comments={numberOfNewComments} />
      }
      {
        section.fields && <ChangedBadge fields={fields} protocolId={values.id} />
      }
    </Fragment>
  )
}

const getTitle = (section, newComments, values) => (
  <Fragment>
    {
      section.fields && getBadges(section, newComments, values)
    }
    <div>{ section.title }</div>
  </Fragment>
)

const sortGranted = sections => (a, b) => {
  return sections[a].granted.order - sections[b].granted.order;
}

const ProtocolSections = ({ sections, protocolState, editable, newComments, ...props }) =>  {
  let sectionNames = Object.keys(sections)
    .filter(section => !sections[section].show || sections[section].show(props));

  if (props.isGranted && !props.isFullApplication && props.schemaVersion > 0) {
    sectionNames = sectionNames.sort(sortGranted(sections));
  }
  return (
  <Accordion open={getOpenSection(protocolState, editable, sections)} toggleAll={!props.pdf} pdf={props.pdf}>
    {
      sectionNames.map((section, sectionIndex) => (
        <ExpandingPanel key={section} title={getTitle(sections[section], newComments, props.values)} className={section.toLowerCase()}>
          {
            getSection(section, { ...props, protocolState, editable, ...sections[section], sectionsLength: size(sections), sectionIndex, newComments })
          }
        </ExpandingPanel>
      ))
    }
  </Accordion>
)}

const mapStateToProps = ({
  application: {
    schemaVersion,
    showConditions,
    isGranted,
    isFullApplication
  }
}, { sections }) => ({
  schemaVersion,
  showConditions,
  isGranted,
  isFullApplication,
  // show all sections for legacy
  sections: isGranted && !isFullApplication && schemaVersion !== 0
    ? pickBy(sections, section => section.granted)
    : sections
});

export default connect(mapStateToProps)(ProtocolSections);
