import * as React from 'react';
import { MissionModel } from './models/MissionModel';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface Props {
  mission: MissionModel;
  className?: string;
}

export const Mission = (props: Props) => {
  const {id, atoMissionNumber, displayDateZulu, displayStartAndEndTime} = props.mission;
  return (
    <span className={`${props.className} mission-card`}>
      <h3>{atoMissionNumber}</h3>
      <div>
        <div>
            <div>{displayDateZulu}</div>
            <div>{displayStartAndEndTime}</div>
        </div>
        <Link className="crew-link" to={`/dashboard/crew/${id}`}>
          VIEW
        </Link>
      </div>
    </span>
  );
};

export const StyledMission = styled(Mission)`
  background-color: ${props => props.theme.lighter};
  width: calc(94% / 3);
  min-height: 8rem;
  padding: 1rem;
  margin: 10px;
  
  h3 {
    margin: 0 0 1rem 0;
    font-weight: 300;
  }
  
  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .crew-link {
    display: inline-block;
    padding: 0.5rem 1rem;
    border: 1px solid ${props => props.theme.fontColor};
    color: ${props => props.theme.fontColor};
    text-decoration: none;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 400;
    &:hover {
      color: ${props => props.theme.dark};
      background: ${props => props.theme.fontColor};
      text-decoration: underline;    
    }
  }
`;
