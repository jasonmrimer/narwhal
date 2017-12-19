import * as React from 'react';
import { MissionModel } from './models/MissionModel';
import styled from 'styled-components';

interface Props {
  mission: MissionModel;
  className?: string;
}

export const Mission = (props: Props) => {
  return (
    <div className={props.className}>
      {props.mission.atoMissionNumber}
    </div>
  );
};

export default styled(Mission)`
  background-color: ${props => props.theme.lighter};
  width: 25%;
  min-height: 100px;
  padding: 0.75rem;
`;