import * as React from 'react';
import { StyledMissionPlanner } from '../../crew/MissionPlanner';
import { observer } from 'mobx-react';
import { MissionPlannerStore } from '../../crew/stores/MissionPlannerStore';
import { StyledTopBar } from '../TopBar';

interface Props {
  missionPlannerStore: MissionPlannerStore;
  username: string;
  crewId: number;
}

export const CrewPage = observer((props: Props) => {
  return (
    <React.Fragment>
      <StyledTopBar
        username={props.username}
      />
      <StyledMissionPlanner
        crewId={props.crewId}
        missionPlannerStore={props.missionPlannerStore}
      />
    </React.Fragment>
  );
});