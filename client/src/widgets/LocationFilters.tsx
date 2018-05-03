import * as React from 'react';
import { StyledDropdown } from './Dropdown';
import { TopLevelFilter } from './Filter';
import styled from 'styled-components';
import { caret } from '../utils/StyleUtils';
import * as classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { LocationFilterStore } from './stores/LocationFilterStore';

interface Props {
  locationFilterStore?: LocationFilterStore;
  refreshAirmen: () => Promise<void>;
  className?: string;
}

export const LocationFilters = observer((props: Props) => {
  const {locationFilterStore} = props;
  const {
    siteOptions,
    selectedSiteId,
    setSelectedSite,
    selectedSquadronId,
    setSelectedSquadron,
    squadronOptions,
    selectedFlightId,
    setSelectedFlight,
    flightOptions
  } = locationFilterStore!;

  return (
    <div className={classNames('filters', props.className)}>
      <div id="site-filter-container">
        <label htmlFor="site-filter">SITE</label>
        <br/>
        <StyledDropdown
          id="site-filter"
          name="siteId"
          options={siteOptions}
          value={selectedSiteId}
          onChange={async (e: any) => {
            setSelectedSite(Number(e.target.value));
            await props.refreshAirmen();
          }}
        />
      </div>
      <TopLevelFilter
        id="squadron-filter"
        label="SQUADRON"
        unfilteredOptionLabel="All Squadrons"
        value={selectedSquadronId}
        callback={setSelectedSquadron}
        options={squadronOptions}
        notification="Please select a site first."
      />
      <TopLevelFilter
        id="flight-filter"
        label="FLIGHT"
        unfilteredOptionLabel="All Flights"
        value={selectedFlightId}
        callback={setSelectedFlight}
        options={flightOptions}
        notification="Please select a squadron first."
      />
    </div>
  );
});

export const StyledLocationFilters = inject('locationFilterStore')(styled(LocationFilters)`
  .filters {
    &:after {
      content: "."; 
      visibility: hidden; 
      display: block; 
      height: 0;
      clear: both;
    }
  }

  #site-filter-container {
    min-width: 28%;
    display: inline-block;
    position: relative;
    z-index: 9;
    font-size: 0.875rem;
    font-weight: 300;
    color: ${props => props.theme.purpleSteel};

    &:after {
      content: ' ';
      background: ${props => caret(false)};
      right: 0;
      height: 14px;
      width: 20px;
      top: 40px;
      position: absolute;
      pointer-events: none;
    }
  }
  
  #site-filter {
    background: transparent;
    display: block;
    width: 100%;
    height: 48px;
    float: right;
    margin: 0 0 5px 0;
    font-size: 1rem;
    font-weight: 300;
    border: none;
    border-bottom: 1px solid ${props => props.theme.purpleSteel};
    color: ${props => props.theme.fontColor};
    border-radius: 0;
    cursor: pointer;
  }
`);
