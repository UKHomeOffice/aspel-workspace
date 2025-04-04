import React, { Fragment } from 'react';
import content from '../named-person-mvp/mandatory-training/content/mandatory-training-requirements-for-roles';

export default function MandatoryTrainingRequirements({ roleType }) {

  const renderModuleContent = (content) => {
    return content.map((el, index) => (
      <Fragment key={index}>
        {el}
        <br />
      </Fragment>
    ));
  };

  const renderModuleTag = (tag) => (
    <>
      <br />
      <div style={{ backgroundColor: '#fff7bf', color: '#594d00', fontSize: '14px', textAlign: 'center' }}>
        {tag}
      </div>
    </>
  );

  const renderModules = (modules) => {
    return Object.entries(modules).map(([module, moduleDetails]) => {
      return (
        <tr key={module} className="govuk-table__row">
          <td className="govuk-table__cell">
            {module}
            {moduleDetails.tag && renderModuleTag(moduleDetails.tag)}
          </td>
          <td className="govuk-table__cell">{renderModuleContent(moduleDetails.content)}</td>
        </tr>
      );
    });
  };

  const contentForRoleType = content[roleType]

  return (
    <div className="govuk-box requirements-box">
      <Fragment>
        <h2>{contentForRoleType.title}</h2>
        <table className="govuk-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Module number and content</th>
            </tr>
          </thead>
          <tbody>
            {renderModules(contentForRoleType.modules)}
            <tr>
              <td colSpan="2">
                <div className="govuk-heading-s">{contentForRoleType.additional.title}</div>
              </td>
            </tr>
            {renderModules(contentForRoleType.additional.modules)}
          </tbody>
        </table>
      </Fragment>
    </div>
  );
}
