import * as React from 'react';
import { StyledCrew } from '../../crew/Crew';
import { CrewStore } from '../../crew/stores/CrewStore';
import { observer } from 'mobx-react';

interface Props {
  crewStore: CrewStore;
  crewId: number;
}

export const CrewPage = observer((props: Props) => {
  return (
    <StyledCrew
      crewId={props.crewId}
      crewStore={props.crewStore}
    />
  );
});