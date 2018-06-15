import styled from 'styled-components';
import { RosterHeader } from '../roster/RosterHeader';
import { inject, observer } from 'mobx-react';

@observer
export class MissionPlannerRosterHeader extends RosterHeader {}

export const StyledMissionPlannerRosterHeader =
  inject('rosterHeaderStore')(styled(MissionPlannerRosterHeader)`
  all: unset;

  background-color: ${props => props.theme.lightest};
  border-left: 1px solid ${props => props.theme.graySteel};
  display: flex;
  flex-grow: 3;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  max-width: 868px;
  min-width: 837px;
  
  .header-column-title {
    font-size: 0.875rem;
    font-weight: 500;  
  }
  
  & > span {
    width: 23%;
      
    & > input, select {
      padding: 0.5rem 0;
    }  
  }
  
  .shift {
   width: 5rem;
  }

`);