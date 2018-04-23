import * as React from 'react';
import { SidePanelStore, TabType } from './stores/SidePanelStore';
import { TrackerStore } from './stores/TrackerStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { CurrencyStore } from '../currency/stores/CurrencyStore';

export interface Props {
  trackerStore?: TrackerStore;
  availabilityStore?: AvailabilityStore;
  currencyStore?: CurrencyStore;
  sidePanelStore?: SidePanelStore;
  airman: AirmanModel;
  tab: TabType;
  children?: JSX.Element | JSX.Element[];
  className: string;
}

export const AirmanDatum =
  (props: Props) => {
  const {className, trackerStore, airman, availabilityStore, currencyStore, sidePanelStore, tab} = props;
  return (
    <span
      className={className}
      onClick={async (e: any) => {
        e.stopPropagation();
        trackerStore!.setSelectedAirman(airman);
        availabilityStore!.closeEventForm();
        currencyStore!.closeSkillForm();
        await currencyStore!.setRipItemsForAirman(airman.id);
        sidePanelStore!.setSelectedTab(tab);
        availabilityStore!.setAirmanEvents(trackerStore!.selectedAirmanEvents);
      }}
    >
      {props.children}
    </span>
  );
};

export const StyledAirmanDatum = inject(
  'trackerStore',
  'availabilityStore',
  'sidePanelStore',
  'currencyStore'
)(styled(AirmanDatum)`
  .expired {
    border: 1px solid ${props => props.theme.yellow};
    padding: 0.125rem;
    border-radius: 2px;
  }
`);
