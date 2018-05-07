import * as React from 'react';
import { MissionModel } from './models/MissionModel';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { StyledCrewStatus } from '../widgets/CrewStatus';

interface Props {
  mission: MissionModel;
  className?: string;
}

export const Mission = (props: Props) => {
  const {
    id,
    atoMissionNumber,
    site,
    displayDateZulu,
    displayStartAndEndTime,
    hasCrew,
    updatedAt,
    displayUpdatedAt
  } = props.mission;

  return (
    <Link className={`${props.className} mission-card`} to={`/dashboard/crew/${id}`}>
      <div className="mission-header">
        <div className="ato">{atoMissionNumber}</div>
        <StyledCrewStatus
          hasCrew={hasCrew}
        />
      </div>
      <div className="mission-details">
        <div className="core-site">CORE SITE: {site ? site.name : 'Unassigned'}</div>
        <div className="mission-date">
          <div>{displayDateZulu}</div>
          <div>{displayStartAndEndTime}</div>
        </div>
        {
          updatedAt ?
            <div className="last-update">Last updated {displayUpdatedAt}.</div> :
            <div className="no-update"/>
        }
      </div>
    </Link>
  );
};

export const StyledMission = styled(Mission)`
  background-color: ${props => props.theme.lighter};
  width: calc(94% / 3);
  min-height: 8rem;
  padding: 1rem 1rem 0;
  margin: 10px;
  text-decoration: none;
  color: ${props => props.theme.fontColor};
  border-bottom: 0.25rem solid ${props => props.mission.hasCrew ? props.theme.copper : props.theme.fontColor};
 
  
  .mission-header {
    display: flex;
    justify-content: space-between;
    
    .ato {
      font-size: 1.25rem;
    }
  }
  
  .mission-details {
    .core-site {
      font-size: 0.75rem;
      margin-bottom: 1rem;
    }
    
    .last-update {
      font-size: 0.75rem;
      margin: 1rem 0 0.5rem;
    }
    
    .no-update {
      margin-top: 2.375rem;
    }
  }
`;
