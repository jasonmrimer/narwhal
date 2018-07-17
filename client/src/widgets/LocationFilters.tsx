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
      <div className="filter-container">
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
          clearButton={false}
          className="site-filter"
          selected={selectedSiteOption}
          placeholder="Select Site"
          filterBy={() => {return true}}
        />
      </div>
      <div className="filter-container">
        <label htmlFor="squadron-filter">SQUADRON</label>
        <br/>
        <StyledSingleTypeahead
          options={squadronOptions}
          onChange={(e) => {
            setSelectedSquadron(e === null ? null : Number(e.value));
          }}
          clearButton={false}
          className="squadron-filter"
          selected={selectedSquadronOption}
          placeholder="All Squadrons"
          filterBy={() => {return true}}
        />
      </div>
      <div className="filter-container">
        <label htmlFor="flight-filter">FLIGHT</label>
        <StyledSingleTypeahead
          options={flightOptions}
          onChange={(e) => {
            setSelectedFlight(e === null ? null : Number(e.value));
          }}
          clearButton={false}
          className="flight-filter"
          selected={selectedFlightOption}
          placeholder="All Flights"
          filterBy={() => {return true}}
        />
      </div>
    </div>
  );
});

export const StyledLocationFilters = inject('locationFilterStore')(styled(LocationFilters)`
  .filter-container {
    margin: 0 2.5rem 0 0;
    min-width: 28%;
    display: inline-block;
    position: relative;
    z-index: 9;
    font-size: 0.875rem;
    font-weight: 300;
    color: ${props => props.theme.purpleSteel};
  }
`);
