import * as React from 'react';
import { TabType } from './stores/SidePanelStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import styled from 'styled-components';
import { SidePanelActions } from './SidePanelActions';
import { inject } from 'mobx-react';

export interface Props {
  airman: AirmanModel;
  tab: TabType;
  children?: JSX.Element | JSX.Element[];
  sidePanelActions?: SidePanelActions;
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
          await props.sidePanelActions!.openSidePanel(airman, tab);
        }}
      >
        {props.children}
      </span>
    );
  };

export const StyledAirmanDatum = inject('sidePanelActions')(styled(AirmanDatum)`
  .expired {
    border-bottom: 2px solid ${props => props.theme.yellow};
    padding: 0.125rem;
    border-radius: 2px;
  }
`);
