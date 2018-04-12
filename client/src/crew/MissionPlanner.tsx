import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { BackArrow } from '../icons/BackArrow';
import { Theme } from '../themes/default';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { StyledCrew } from './Crew';
import { StyledMissionPlannerRosterContainer } from './MissionPlannerRosterContainer';
import { MissionPlannerStore } from './stores/MissionPlannerStore';
import { StyledLocationFilters } from '../widgets/LocationFilters';
import { StyledPrintableMissionPlanner } from './PrintableMissionPlanner';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledForm } from '../widgets/Form';

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
      <React.Fragment>
        <div className={this.props.className}>
          {missionPlannerStore.loading && <StyledLoadingOverlay/>}
          <Link to="/">
            <BackArrow color={Theme.graySteel}/>
            <span>Back to Availability Roster</span>
          </Link>
          <div className="mission-details">
            <h1>{crew.mission.atoMissionNumber}</h1>
            <span>MSN DATE: {crew.mission.displayDateZulu}</span>
            <span>MSN START: {crew.mission.displayStartTime}</span>
            <span>MSN END: {crew.mission.displayEndTime}</span>
          </div>
          <StyledForm
            onSubmit={async (e) => {
              e.preventDefault();
              await this.props.missionPlannerStore.crewStore.save();
            }}
            setLoading={missionPlannerStore.setLoading}
          >
            <div className="mission-header">
              <StyledSubmitButton
                text="SAVE"
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
          </StyledForm>
        </div>
        <StyledPrintableMissionPlanner key="1" crew={crew}/>
      </React.Fragment>
    );
  }
}

export const StyledMissionPlanner = styled(MissionPlanner)`
  padding: 0.5rem;
  margin-left: 3rem;
  width: 1698px;
  
  @media print {
    display: none;
  }
    
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
    align-items: flex-end;
    justify-content: flex-end;
    
    & > * {
      margin-left: 2rem;
      margin-right: 0;
    }
  }
  
  form {
    color: ${props => props.theme.fontColor};
  }
`;