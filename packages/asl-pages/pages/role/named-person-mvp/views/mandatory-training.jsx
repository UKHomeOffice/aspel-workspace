import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form, TrainingSummary, Details, Inset, SupportingLinks, Link, ErrorSummary } from '@ukhomeoffice/asl-components';
import MandatoryTrainingRequirements from '../../component/mandatory-training-requirements';
import mandatoryTrainingSupportingLinks from '../content/supporting-links';

const Page = () => {
  const { profile, role } = useSelector(state => state.static, shallowEqual);
  const roleType = role.type;

  const renderTrainingIntro = () => {
    if (roleType === 'nacwo') {
      return (
        <p className="govuk-body">
          <Snippet>nacwoTrainingDesc</Snippet>
        </p>
      );
    }

    if (roleType === 'nvs' || roleType === 'sqp') {
      return (
        <>
          <p className="govuk-body">
            <Snippet>nvsAndSqpTrainingDesc</Snippet>
          </p>

          {roleType === 'nvs' && (
            <Inset>
              <p className="govuk-body">
                <Snippet>nvsException</Snippet>
              </p>
            </Inset>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <ErrorSummary />
        <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>
        <Form cancelLink="profile.read">
          <Header title={<Snippet roleType={roleType.toUpperCase()}>title</Snippet>} />

          {renderTrainingIntro()}

          <Details
            summary={<Snippet roleType={roleType.toUpperCase()}>mandatoryTrainingRequirements</Snippet>}
            className="margin-bottom"
            id="mandatory-training-summary"
            role="group"
          >
            <Inset>
              <MandatoryTrainingRequirements roleType={roleType} />
            </Inset>
          </Details>

          <Details
            summary={<Snippet>checkTrainingRecord</Snippet>}
            className="margin-bottom"
            id="check-training-summary"
            role="group"
          >
            <Inset>
              <TrainingSummary certificates={profile.certificates} />
              <Link page="training.dashboard" label={<Snippet>updateTrainingRecord</Snippet>} />
            </Inset>
          </Details>
        </Form>
      </div>

      <SupportingLinks
        sectionTitle={<Snippet>supportingGuidanceTitle</Snippet>}
        links={mandatoryTrainingSupportingLinks(roleType)}
      />
    </div>
  );
};

export default Page;
