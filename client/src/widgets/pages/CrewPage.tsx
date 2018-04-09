import * as React from 'react';
import { StyledMissionPlanner } from '../../crew/MissionPlanner';
import { observer } from 'mobx-react';
import { MissionPlannerStore } from '../../crew/stores/MissionPlannerStore';

interface Props {
  missionPlannerStore: MissionPlannerStore;
  crewId: number;
}

export const CrewPage = observer((props: Props) => {
  return (
    <StyledMissionPlanner
      crewId={props.crewId}
      missionPlannerStore={props.missionPlannerStore}
    />
  );
});