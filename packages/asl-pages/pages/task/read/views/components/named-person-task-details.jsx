import React from 'react';
import { DetailsByRole, NamedPersonDetails, SkillsAndExperience } from '../../../../common/components/role-change-summary';
import {
  Snippet,
  TrainingSummary,
  Details,
  Inset
} from '@ukhomeoffice/asl-components';
import MandatoryTrainingRequirements from '../../../../role/component/mandatory-training-requirements';

export const NamedPersonTaskDetails = ({ taskData, profile }) => {

  return (
    <>
      <br />
      <dl>
        <div className="sticky-nav-anchor">
          <NamedPersonDetails roleType={taskData.type} profile={profile} roleDetails={taskData} />
          <DetailsByRole incompleteTraining={taskData} mandatoryTraining={taskData.mandatory} role={taskData.type} roleDetails={taskData} showHeading />
          <SkillsAndExperience roleType={taskData.type} profile={profile} values={taskData} showHeading />
        </div>

        {['nacwo', 'nvs'].includes(taskData.type) && (
          <>
            <div className="sticky-nav-anchor">
              <h2><Snippet>trainingRecord</Snippet></h2>
              <TrainingSummary certificates={profile.certificates} />
            </div>
            <div>
              <Details
                summary={`${taskData.type.toUpperCase()} mandatory training requirements`}
                className="margin-bottom"
                id="mandatory-training-summary"
                role="group"
              >
                <Inset>
                  <MandatoryTrainingRequirements roleType={taskData.type} />
                </Inset>
              </Details>
            </div>
          </>
        )}
      </dl>
    </>
  );
};
