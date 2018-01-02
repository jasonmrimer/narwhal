import * as React from 'react';
import { MissionModel } from './models/MissionModel';
import styled from 'styled-components';

interface Props {
  mission: MissionModel;
  className?: string;
}

export const Mission = (props: Props) => {
  const {atoMissionNumber, startDateTime, endDateTime} = props.mission;
  return (
    <span className={`${props.className} mission-card`} >
      <div>{atoMissionNumber}</div>
      <div>MSN DATE: {startDateTime.format('DD MMM YY').toUpperCase()}</div>
      <div>MSN START: {startDateTime.format('HHmm[Z]')}</div>
      <div>MSN END: {endDateTime ? endDateTime.format('HHmm[Z]') : 'TBD'}</div>
    </span>
  );
};

export default styled(Mission)`
  background-color: ${props => props.theme.lighter};
  width: calc(31% + 1% / 3);
  min-height:  8rem;
  padding: calc(1% / 3);
  margin-right: calc(2% / 3);
  margin-bottom: calc(4% / 3);
  margin-left: calc(2% / 3);
`;
