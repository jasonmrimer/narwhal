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
    <span className={props.className}>
      <div>{atoMissionNumber}</div>
      <div>MSN DATE: {startDateTime.format('DD MMM YY').toUpperCase()}</div>
      <div>MSN START: {startDateTime.format('HHmm[Z]')}</div>
      <div>MSN END: {endDateTime ? endDateTime.format('HHmm[Z]') : 'TBD'}</div>
    </span>
  );
};

export default styled(Mission)`
  background-color: ${props => props.theme.lighter};
  width: 25%;
  min-height: 100px;
  padding: 0.75rem;
`;