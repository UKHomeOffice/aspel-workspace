import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form, SupportingLinks } from '@ukhomeoffice/asl-components';
import namedPersonGuidance from '../content/named-person-guidance';
import { ROLE_TYPES } from '../role-types';

const { getBeforeYouApplySupportingLinks } = namedPersonGuidance;

const Page = () => {

  const { content, profile, roleType } = useSelector(state => state.static, shallowEqual);
  const templateRole = content.beforeYouNominateText.templateRoles[roleType] || {};
  const templateKey = templateRole.contentKey;
  const titleKey = templateKey ? `beforeYouNominateText.${templateKey}.title` : `beforeYouNominateText.${roleType}.title`;
  const descKey = templateKey ? `beforeYouNominateText.${templateKey}.desc` : `beforeYouNominateText.${roleType}.desc`;

  return (
    <div>
      <span className="govuk-caption-l">{profile.firstName} {profile.lastName}</span>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Form cancelLink="profile.read">
            <Header
              title={
                <Snippet {...templateRole}>
                  {titleKey}
                </Snippet>
              }
            />
            <div className="govuk-body">
              {
                <Snippet {...templateRole}>
                  {descKey}
                </Snippet>
              }
            </div>
          </Form>
        </div>

        { roleType.toLowerCase() !== ROLE_TYPES.holc && (
          <SupportingLinks sectionTitle={<Snippet>supportingGuidanceTitle</Snippet>} links={getBeforeYouApplySupportingLinks(roleType)} />
        )}
      </div>
    </div>
  );
};

export default Page;
