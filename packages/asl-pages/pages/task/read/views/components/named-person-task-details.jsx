import React from 'react';
import { DetailsByRole, NamedPersonDetails } from '../../../../common/components/role-change-summary';
import {
  TrainingSummary,
  Details,
  Inset
} from '@ukhomeoffice/asl-components';
import MandatoryTrainingRequirements from '../../../../role/component/mandatory-training-requirements';

export const NamedPersonTaskDetails = ({ taskData, profile }) => {

  return (
    <dl>
      <div className="sticky-nav-anchor">
        <NamedPersonDetails roleType={taskData.type} profile={profile} />
        <DetailsByRole incompleteTraining={taskData} mandatoryTraining={taskData.mandatory} role={taskData.type} roleDetails={taskData} />
      </div>
      <div className="sticky-nav-anchor">
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
    </dl>
  );
};
