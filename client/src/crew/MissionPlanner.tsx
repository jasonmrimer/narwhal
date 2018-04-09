import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { StyledButton } from '../widgets/Button';
import { Link } from 'react-router-dom';
import { BackArrow } from '../icons/BackArrow';
import { Theme } from '../themes/default';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { StyledCrew } from './Crew';
import { StyledMissionPlannerRosterContainer } from './MissionPlannerRosterContainer';
import { MissionPlannerStore } from './stores/MissionPlannerStore';
import { StyledLocationFilters } from '../widgets/LocationFilters';

interface Props {
  crewId: number;
  missionPlannerStore: MissionPlannerStore;
  className?: string;
}

@observer
export class MissionPlanner extends React.Component<Props> {
  async componentDidMount() {
    await this.props.missionPlannerStore.hydrate(this.props.crewId);
  }

  render() {
    const {missionPlannerStore} = this.props;
    const crew = missionPlannerStore.crewStore.crew;

    if (crew == null) {
      return null;
    }

    return (
      <div className={this.props.className}>
        {missionPlannerStore.loading && <StyledLoadingOverlay/>}
        <Link to="/">
          <BackArrow color={Theme.graySteel}/>
          <span>Back to Availability Roster</span>
        </Link>
        <div className="mission-details">
          <h1>{crew.mission.atoMissionNumber}</h1>
          <span>MSN DATE {crew.mission.displayDate}</span>
          <span>MSN START {crew.mission.displayStartTime}</span>
          <span>MSN END {crew.mission.displayEndTime}</span>
        </div>
        <div className="mission-header">
          <StyledButton
            text="SAVE"
            onClick={missionPlannerStore.crewStore.save}
          />
          <StyledLocationFilters
            locationFilterStore={missionPlannerStore.locationFilterStore}
          />
        </div>
        <div className="mission-planner">
          <StyledCrew
            crewStore={missionPlannerStore.crewStore}
            className="crew-list"
          />
          <StyledMissionPlannerRosterContainer
            missionPlannerStore={missionPlannerStore}
          />
        </div>
      </div>
    );
  }
}

export const StyledMissionPlanner = styled(MissionPlanner)`
  margin-left: 3rem;
  width: 1698px;
  
  .mission-details {
    margin-bottom: 2rem;
    
    span {
      margin-right: 2rem;
    }
  }
  
  & > button {
    margin-bottom: 1.5rem;
  }
  
  a {
    text-decoration: none;
    font-size: 0.875rem;
    color: ${props => props.theme.graySteel};
    display: flex;
    justify-content: left;
    align-items: center;
    
    span {
      margin-left: 0.5rem;
    }
  } 

  .mission-planner {
    display: flex;
    flex-direction: row;
  }
  
  .crew-list {
    margin-right: 2rem;
  }
  
  .mission-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    
    & > button {
      padding: 0.5rem 3.25rem;
      height: 2.125rem;
      border: 1px solid ${props => props.theme.yellow};
      color: ${props => props.theme.yellow};
    }
  }
  
  .filters {
    width: 50%;
    display: flex;
    justify-content: flex-end;
    
    & > * {
      margin-left: 2rem;
      margin-right: 0;
    }
  }
`;