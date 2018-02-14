import * as React from 'react';
import { StyledRoster } from '../roster/Roster';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { TrackerStore } from './stores/TrackerStore';
import { TopLevelFilter } from '../widgets/Filter';
import { StyledSidePanel } from './SidePanel';
import { StyledLegend } from '../roster/Legend';
import { StyledDeleteEventPopup } from '../event/DeleteEventPopup';
import { StyledTopBar } from '../widgets/TopBar';

interface Props {
  trackerStore: TrackerStore;
  username: string;
  className?: string;
}

@observer
export class Tracker extends React.Component<Props> {
  componentDidMount() {
    this.props.trackerStore.hydrate();
  }

  render() {
    const {username, className} = this.props;
    return (
      [
        <StyledTopBar key="0" username={username} pageTitle="AVAILABILITY ROSTER"/>,
        (
          <div key="1" className={className}>
            <div className="main">
              <div className="filters">
                <TopLevelFilter
                  id="site-filter"
                  label="SITE"
                  unfilteredOptionLabel="All Sites"
                  value={this.props.trackerStore.siteId}
                  callback={this.props.trackerStore.setSiteId}
                  options={this.props.trackerStore.siteOptions}
                />
                <TopLevelFilter
                  id="squadron-filter"
                  label="SQUADRON"
                  unfilteredOptionLabel="All Squadrons"
                  value={this.props.trackerStore.squadronId}
                  callback={this.props.trackerStore.setSquadronId}
                  options={this.props.trackerStore.squadronOptions}
                />
                <TopLevelFilter
                  id="flight-filter"
                  label="FLIGHT"
                  unfilteredOptionLabel="All Flights"
                  value={this.props.trackerStore.flightId}
                  callback={this.props.trackerStore.setFlightId}
                  options={this.props.trackerStore.flightOptions}
                />
              </div>
              <div>
                <StyledLegend/>
              </div>
              <StyledRoster trackerStore={this.props.trackerStore}/>
            </div>
            {
              !this.props.trackerStore.selectedAirman.isEmpty &&
              <StyledSidePanel
                trackerStore={this.props.trackerStore}
              />
            }
            {
              this.props.trackerStore.availabilityStore.pendingDeleteEvent &&
              <StyledDeleteEventPopup
                event={this.props.trackerStore.availabilityStore.pendingDeleteEvent}
                cancelPendingDeleteEvent={this.props.trackerStore.availabilityStore.setPendingDeleteEvent}
                confirmPendingDeleteEvent={this.props.trackerStore.deleteEvent}
              />
            }
          </div>
        )]
    );
  }
}

export const StyledTracker = styled(Tracker)`
  width: 80%;
  margin-left: 48px;
  padding: 0.5rem;
  display: flex;
  color: white;
  
  .filters {
     &:after {
      content: "."; 
       visibility: hidden; 
       display: block; 
       height: 0; 
       clear: both;
     }
  }
  
  .main {
    width: 100%;
  }
 `;
