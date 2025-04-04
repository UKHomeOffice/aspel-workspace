import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form, TrainingSummary, Details, Inset, SupportingLinks, Link } from '@ukhomeoffice/asl-components';
import MandatoryTrainingRequirements from '../../../component/mandatory-training-requirements';
import content from '../content/index';
import mandatoryTrainingSupportingLinks from '../content/supporting-links';

const Page = () => {
  const { profile, role } = useSelector(state => state.static, shallowEqual);
  const roleType = role.type;

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <span className="govuk-caption-l">{profile.firstName} {profile.lastName}</span>
        <Form cancelLink="profile.read">
          <Header title={<Snippet roleType={roleType.toUpperCase()}>title</Snippet>}/>
          <p className="govuk-body">{content.mandatoryTrainingDesc}</p>
          <ul className="govuk-list govuk-list--bullet govuk-list--spaced">
            <li>{content.trianingUnless1}</li>
            <li>{content.trianingUnless2}</li>
          </ul>

          <Details summary={<Snippet roleType={roleType.toUpperCase()}>mandatoryTrainingRequirements</Snippet>} className="margin-bottom">
            <Inset><MandatoryTrainingRequirements roleType={roleType}/></Inset>
          </Details>

          <Details summary={<Snippet>checkTrainingRecord</Snippet>} className="margin-bottom">
            <Inset>
              <TrainingSummary certificates={profile.certificates} />
              <Link page="training.dashboard" label="Manage training"/>
            </Inset>
          </Details>
        </Form>
      </div>

      <SupportingLinks sectionTitle={<Snippet>supportingGuidanceTitle</Snippet>} links={mandatoryTrainingSupportingLinks(roleType)} />
    </div>
  );
};

export default Page;

