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
  const {id, atoMissionNumber, displayDateZulu, displayStartAndEndTime, hasCrew} = props.mission;
  return (
    <span className={`${props.className} mission-card`}>
      <div className="left">
        <div className="ato">{atoMissionNumber}</div>
        <StyledCrewStatus
          hasCrew={hasCrew}
        />
        <div>
            <div>{displayDateZulu}</div>
            <div>{displayStartAndEndTime}</div>
        </div>
      </div>
      <Link className="right" to={`/dashboard/crew/${id}`}>
        VIEW
      </Link>
    </span>
  );
};

export const StyledMission = styled(Mission)`
  background-color: ${props => props.theme.lighter};
  width: calc(94% / 3);
  min-height: 8rem;
  padding: 1rem;
  margin: 10px;
  display: flex;
  justify-content: space-between;
  
  div {
    margin-bottom: 0.5rem;
  }
  
  .right {
    padding: 0.5rem 1rem;
    border: 1px solid ${props => props.theme.fontColor};
    color: ${props => props.theme.fontColor};
    text-decoration: none;
    text-align: center;
    font-size: 0.825rem;
    font-weight: 400;
    align-self: center;
    
    &:hover {
      color: ${props => props.theme.dark};
      background: ${props => props.theme.fontColor};
      text-decoration: underline;    
    }
  }
  
  .ato {
    font-size: 20px;
  }
`;
