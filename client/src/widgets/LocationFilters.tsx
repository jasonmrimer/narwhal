import * as React from 'react';
import { StyledDropdown } from './Dropdown';
import { TopLevelFilter } from './Filter';
import { LocationFilterStore } from './stores/LocationFilterStore';
import styled from 'styled-components';
import { caret } from '../utils/StyleUtils';
import * as classNames from 'classnames';
import { observer } from 'mobx-react';

interface Props {
  locationFilterStore: LocationFilterStore;
  className?: string;
}

export const LocationFilters = observer((props: Props) => {
  const {locationFilterStore} = props;
  return (
    <div className={classNames('filters', props.className)}>
      <div id="site-filter-container">
        <label htmlFor="site-filter">SITE</label>
        <br/>
        <StyledDropdown
          id="site-filter"
          name="siteId"
          options={locationFilterStore.siteOptions}
          value={locationFilterStore.selectedSite}
          onChange={async (e: any) => {
            await locationFilterStore.setSelectedSite(Number(e.target.value));
          }}
        />
      </div>
      <TopLevelFilter
        id="squadron-filter"
        label="SQUADRON"
        unfilteredOptionLabel="All Squadrons"
        value={locationFilterStore.selectedSquadron}
        callback={locationFilterStore.setSelectedSquadron}
        options={locationFilterStore.squadronOptions}
        notification="Please select a site first."
      />
      <TopLevelFilter
        id="flight-filter"
        label="FLIGHT"
        unfilteredOptionLabel="All Flights"
        value={locationFilterStore.selectedFlight}
        callback={locationFilterStore.setSelectedFlight}
        options={locationFilterStore.flightOptions}
        notification="Please select a squadron first."
      />
    </div>
  );
});

export const StyledLocationFilters = styled(LocationFilters)`
  .filters {
    label {
      font-size: 0.875rem;
      font-weight: 300;
      color: ${props => props.theme.purpleSteel};
    }
    
    &:after {
      content: "."; 
      visibility: hidden; 
      display: block; 
      height: 0;
      clear: both;
    }
  }

  #site-filter-container {
    min-width: 20%;
    display: inline-block;
    position: relative;
    float: left;
    z-index: 9;

    &:after {
      content: ' ';
      background: ${props => caret(false)};
      right: 0;
      height: 14px;
      width: 20px;
      top: 43px;
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
`;
