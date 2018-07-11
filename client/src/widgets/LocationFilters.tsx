import * as React from 'react';
import styled from 'styled-components';
import * as classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { LocationFilterStore } from './stores/LocationFilterStore';
import { StyledSingleTypeahead } from './inputs/SingleTypeahead';

interface Props {
  locationFilterStore?: LocationFilterStore;
  refreshAirmen: () => Promise<void>;
  className?: string;
}

export const LocationFilters = observer((props: Props) => {
  const {locationFilterStore} = props;
  const {
    siteOptions,
    selectedSiteOption,
    setSelectedSite,
    selectedSquadronOption,
    setSelectedSquadron,
    squadronOptions,
    selectedFlightOption,
    setSelectedFlight,
    flightOptions
  } = locationFilterStore!;

  return (
    <div className={classNames('filters', props.className)}>
      <div id="site-filter-container">
        <label htmlFor="site-filter">SITE</label>
        <br/>
        <StyledSingleTypeahead
          options={siteOptions}
          onChange={async (e) => {
            await locationFilterStore!.performLoading(async () => {
              setSelectedSite(e === null ? null : Number(e.value));
              await props.refreshAirmen();
            });
          }}
          clearButton={true}
          className="site-filter"
          selected={selectedSiteOption}
          placeholder="Select Site"
        />
      </div>
      <div id="site-filter-container">
        <label htmlFor="squadron-filter">SQUADRON</label>
        <br/>
        <StyledSingleTypeahead
          options={squadronOptions}
          onChange={(e) => {
            setSelectedSquadron(e === null ? null : Number(e.value));
          }}
          clearButton={true}
          className="squadron-filter"
          selected={selectedSquadronOption}
          placeholder="All Squadrons"
        />
      </div>
      <div id="site-filter-container">
        <label htmlFor="flight-filter">FLIGHT</label>
        <StyledSingleTypeahead
          options={flightOptions}
          onChange={(e) => {
            setSelectedFlight(e === null ? null : Number(e.value));
          }}
          clearButton={true}
          className="flight-filter"
          selected={selectedFlightOption}
          placeholder="All Flights"
        />
      </div>
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
      right: 0;
      height: 14px;
      width: 20px;
      top: 40px;
      position: absolute;
      pointer-events: none;
    }
  }
  
  .site-filter {
    background: transparent;
    display: block;
    width: 100%;
    height: 48px;
    float: right;
    margin: 0 0 5px 0;
    font-size: 1rem;
    font-weight: 300;
    border: none;
    color: ${props => props.theme.fontColor};
    border-radius: 0;
    cursor: pointer;
  }
`);
