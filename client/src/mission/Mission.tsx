import * as React from 'react';
import { MissionModel } from './models/MissionModel';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { StyledButton } from '../widgets/Button';

function noop() {
}

interface Props {
  mission: MissionModel;
  className?: string;
}

export const Mission = (props: Props) => {
  const {id, atoMissionNumber, startDateTime, endDateTime} = props.mission;
  return (
    <span className={`${props.className} mission-card`}>
      <h3>{atoMissionNumber}</h3>
      <div>
        <div>
          <div>MSN DATE: {startDateTime.format('DD MMM YY').toUpperCase()}</div>
          <div>MSN START: {startDateTime.format('HHmm[L]')}</div>
          <div>MSN END: {endDateTime ? endDateTime.format('HHmm[L]') : 'TBD'}</div>
        </div>
        <Link className="crew-link" to={`/crew/${id}`}>
        <StyledButton text="VIEW" onClick={noop}/>
      </Link>
      </div>
    </span>
  );
};

export const StyledMission = styled(Mission)`
  background-color: ${props => props.theme.lighter};
  width: calc(31% + 1% / 3);
  min-height:  8rem;
  padding: 1rem;
  margin-right: calc(2% / 3);
  margin-bottom: calc(4% / 3);
  margin-left: calc(2% / 3);
  
  h3 {
    margin: 0 0 1rem 0;
  }
  
  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .crew-link {
    text-decoration: none;
  }
`;
