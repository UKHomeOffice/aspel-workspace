import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form, SupportingLinks } from '@ukhomeoffice/asl-components';

const Page = () => {

  const { content, profile, roleType } = useSelector(state => state.static, shallowEqual);
  const roleGuide = content.beforeYouNominateText.roleGuides[roleType] || {};
  const isSharedTemplateRole = !!Object.keys(roleGuide).length;
  const titleKey = isSharedTemplateRole ? 'beforeYouNominateText.shared.title' : `beforeYouNominateText.${roleType}.title`;
  const descKey = isSharedTemplateRole ? 'beforeYouNominateText.shared.desc' : `beforeYouNominateText.${roleType}.desc`;

  return (
    <div>
      <span className="govuk-caption-l">{profile.firstName} {profile.lastName}</span>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Form cancelLink="profile.read">
            <Header
              title={
                <Snippet fallback="beforeYouNominateText.default.title" {...roleGuide}>
                  {titleKey}
                </Snippet>
              }
            />
            <div className="govuk-body">
              {
                <Snippet fallback="beforeYouNominateText.default.desc" {...roleGuide}>
                  {descKey}
                </Snippet>
              }
            </div>
          </Form>
        </div>

        <SupportingLinks sectionTitle={<Snippet>supportingGuidanceTitle</Snippet>} links={namedPersonSupportingLinks} />
      </div>
    </div>
  );
};

export default Page;

const namedPersonSupportingLinks = [
  {
    href: 'https://www.gov.uk/guidance/research-and-testing-using-animals#add-a-named-person-role',
    label: 'Adding named person roles'
  },
  {
    href: 'https://www.gov.uk/government/publications/conflict-of-interest-declaration-form-aspa-1986',
    label: 'Make a conflict of interest declaration'
  },
  {
    href: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act',
    label: 'Guidance on training and continuous professional development (CPD) under ASPA'
  },
  {
    href: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986',
    label: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
  }
];
