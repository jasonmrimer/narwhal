import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { StyledCrew } from './Crew';
import { StyledMissionPlannerRosterContainer } from './MissionPlannerRosterContainer';
import { StyledLocationFilters } from '../widgets/LocationFilters';
import { StyledPrintableMissionPlanner } from './PrintableMissionPlanner';
import { StyledSubmitButton } from '../widgets/forms/SubmitButton';
import { StyledForm } from '../widgets/forms/Form';
import { StyledButton } from '../widgets/buttons/Button';
import { StyledCrewStatus } from '../widgets/CrewStatus';
import { StyledNavigationBackButton } from '../widgets/buttons/NavigationBackButton';
import { MissionPlannerActions } from './MissionPlannerActions';
import { MissionPlannerStore } from './stores/MissionPlannerStore';
import { CrewStore } from './stores/CrewStore';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';

interface Props {
  missionPlannerStore?: MissionPlannerStore;
  crewStore?: CrewStore;
  locationFilterStore?: LocationFilterStore;
  missionPlannerActions?: MissionPlannerActions;
  className?: string;
}

@observer
export class MissionPlanner extends React.Component<Props> {

  render() {
    const {missionPlannerStore, crewStore, missionPlannerActions} = this.props;
    const crew = crewStore!.crew;
    if (!crew) {
      return null;
    }
    const {mission} = crew;

    return (
      <React.Fragment>
        <div className={this.props.className}>
          {missionPlannerStore!.loading && <StyledLoadingOverlay/>}
          <StyledNavigationBackButton text="Back to Availability Roster" location="/"/>
          <div className="mission-details">
            <div className="mission-status">
              <h1>{mission.atoMissionNumber}</h1>
              <StyledCrewStatus
                hasCrew={crew.crewPositions.length > 0}
              />
            </div>
            <div className="core-site">CORE SITE: {mission.site ? mission.site.name : 'Unassigned'}</div>
            <span>MSN DATE: {mission.displayDateZulu}</span>
            <span>MSN START: {mission.displayStartTime}</span>
            <span>MSN END: {mission.displayEndTime}</span>
            {
              mission.updatedAt &&
              <div className="last-update">Last updated {mission.displayUpdatedAt}.</div>
            }
          </div>
          <StyledForm
            onSubmit={async (e) => {
              e.preventDefault();
              await missionPlannerActions!.submit();
            }}
            setLoading={missionPlannerStore!.setLoading}
          >
            <div className="mission-header">
              <StyledSubmitButton
                text="SAVE"
              />
              <StyledButton
                text="PRINT"
                onClick={async () => {
                  await missionPlannerActions!.submitAndPrint();
                }}
              />
              <StyledLocationFilters refreshAirmen={missionPlannerActions!.refreshAirman}/>
            </div>
            <div className="mission-planner">
              <StyledCrew className="crew-list"/>
              <StyledMissionPlannerRosterContainer/>
            </div>
          </StyledForm>
        </div>
        <StyledPrintableMissionPlanner crew={crew}/>
      </React.Fragment>
    );
  }
}

export const StyledMissionPlanner = inject(
  'missionPlannerStore',
  'locationFilterStore',
  'crewStore',
  'missionPlannerActions',
)(styled(MissionPlanner)`
  padding: 0.5rem;
  margin-left: 3rem;
  width: 1698px;
  
  @media print {
    display: none;
  }
    
  .mission-details {
    margin-bottom: 1rem;
    font-size: 0.875rem;
    
    .core-site {
     margin-bottom: 0.5rem;
    }
    
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
    align-items: center;
    margin-bottom: 0.75rem;
    
    & > button {
      margin-left: 1rem;
    }
  }
  
  .filters {
    width: 50%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    margin-left: auto;
    
    & > * {
      margin-left: 2rem;
      margin-right: 0;
    }
  }
  
  form {
    color: ${props => props.theme.fontColor};
  }
  
  .mission-status {
    display: flex;
    flex-direction: row;
    width: 16%;
    justify-content: space-between;
  }
  
  .last-update {
    margin-top: 1rem;
    font-size: 0.75rem;
  }
`);
