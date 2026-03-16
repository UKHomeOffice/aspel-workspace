import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form, SupportingLinks } from '@ukhomeoffice/asl-components';

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

        <SupportingLinks sectionTitle={<Snippet>supportingGuidanceTitle</Snippet>} links={namedPersonSupportingLinks(roleType)} />
      </div>
    </div>
  );
};

export default Page;

const namedPersonSupportingLinks = (roleType) => {
  if (roleType === 'NACWO') {
    return [
      {
        href: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-animal-care-and-welfare-officer-role',
        label: 'NACWO role guide'
      },
      {
        href: 'https://www.gov.uk/government/publications/conflict-of-interest-declaration-form-aspa-1986',
        label: 'Make a conflict of interest declaration'
      },
      {
        href: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-animal-care-and-welfare-officers-nacwos',
        label: 'Guidance on training and continuous professional development (CPD) under ASPA'
      },
      {
        href: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-animal-care-and-welfare-officer-nacwo',
        label: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
      }
    ];
  } else if (roleType === 'NVS') {
    return [
      {
        href: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-veterinary-surgeon-role',
        label: 'NVS role guide'
      },
      {
        href: 'https://www.gov.uk/government/publications/conflict-of-interest-declaration-form-aspa-1986',
        label: 'Make a conflict of interest declaration'
      },
      {
        href: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-veterinary-surgeons-nvs',
        label: 'Guidance on training and continuous professional development (CPD) under ASPA'
      },
      {
        href: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-veterinary-surgeon-nvs',
        label: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
      }
    ];
  } else if (roleType === 'SQP') {
    return [
      {
        href: 'https://www.gov.uk/guidance/nominate-someone-for-a-suitably-qualified-person-role',
        label: 'Adding a SQP role'
      },
      {
        href: 'https://www.gov.uk/government/publications/conflict-of-interest-declaration-form-aspa-1986',
        label: 'Make a conflict of interest declaration'
      },
      {
        href: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#other-suitably-qualified-person',
        label: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
      }
    ];
  } else if (roleType === 'NIO') {
    return [
      {
        href: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-information-officer-role',
        label: 'NIO role guide'
      },
      {
        href: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-information-officers-nios',
        label: 'Guidance on training and continuous professional development (CPD) under ASPA'
      },
      {
        href: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-information-officer-nio',
        label: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
      }
    ];
  } else if (roleType === 'NTCO') {
    return [
      {
        href: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-training-and-competency-officer-role',
        label: 'NTCO role guide'
      },
      {
        href: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-training-and-competency-officers-ntcos',
        label: 'Guidance on training and continuous professional development (CPD) under ASPA'
      },
      {
        href: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-training-and-competency-officer-ntco',
        label: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
      }
    ];
  } else if (roleType === 'NPRC') {
    return [
      {
        href: 'https://www.gov.uk/government/publications/conflict-of-interest-declaration-form-aspa-1986',
        label: 'Make a conflict of interest declaration'
      },
      {
        href: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#establishment-licence-holdernamed-person-responsible-for-compliance',
        label: 'Guidance on training and continuous professional development (CPD) under ASPA'
      },
      {
        href: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-person-responsible-for-compliance-nprc',
        label: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
      }
    ];
  } else if (roleType === 'PELH') {
    return [
      {
        href: 'https://www.gov.uk/government/publications/conflict-of-interest-declaration-form-aspa-1986',
        label: 'Make a conflict of interest declaration'
      },
      {
        href: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#establishment-licence-holdernamed-person-responsible-for-compliance',
        label: 'Guidance on training and continuous professional development (CPD) under ASPA'
      },
      {
        href: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#who-can-hold-an-establishment-licence',
        label: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
      }
    ];
  } else if (roleType === 'HOLC') {
    return [
      {
        href: 'https://www.gov.uk/government/publications/conflict-of-interest-declaration-form-aspa-1986',
        label: 'Make a conflict of interest declaration'
      },
      {
        href: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#establishment-licence-holdernamed-person-responsible-for-compliance',
        label: 'Guidance on training and continuous professional development (CPD) under ASPA'
      },
      {
        href: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#who-can-hold-an-establishment-licence',
        label: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
      }
    ];
  }
};
