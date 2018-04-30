import * as React from 'react';
import { TabType } from './stores/SidePanelStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import styled from 'styled-components';
import { RosterActions } from '../roster/RosterActions';

export interface Props {
  airman: AirmanModel;
  tab: TabType;
  children?: JSX.Element | JSX.Element[];
  className: string;
}

export const AirmanDatum =
  (props: Props) => {
  const {className, airman, tab} = props;
  return (
    <span
      className={className}
      onClick={async (e: any) => {
        e.stopPropagation();
        await RosterActions.openSidePanel(airman, tab);
      }}
    >
      {props.children}
    </span>
  );
};

export const StyledAirmanDatum = styled(AirmanDatum)`
  .expired {
    border: 1px solid ${props => props.theme.yellow};
    padding: 0.125rem;
    border-radius: 2px;
  }
`;
