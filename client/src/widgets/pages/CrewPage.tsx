import * as React from 'react';
import { StyledMissionPlanner } from '../../crew/MissionPlanner';
import { observer } from 'mobx-react';
import { MissionPlannerStore } from '../../crew/stores/MissionPlannerStore';
import { StyledTopBar } from '../TopBar';
import { ProfileModel } from '../../profile/models/ProfileModel';

interface Props {
  missionPlannerStore: MissionPlannerStore;
  profile: ProfileModel;
  crewId: number;
}

export const CrewPage = observer((props: Props) => {
  return (
    <React.Fragment>
      <StyledTopBar
        profile={props.profile}
      />
      <StyledMissionPlanner
        crewId={props.crewId}
        missionPlannerStore={props.missionPlannerStore}
      />
    </React.Fragment>
  );
});