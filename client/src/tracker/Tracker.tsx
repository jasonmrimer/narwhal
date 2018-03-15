import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { TrackerStore } from './stores/TrackerStore';
import { TopLevelFilter } from '../widgets/Filter';
import { StyledSidePanel } from './SidePanel';
import { StyledLegend } from '../roster/Legend';
import { UserModel } from '../profile/models/ProfileModel';
import { StyledDeleteEventPopup } from '../event/DeleteEventPopup';
import { UnfilteredValue } from '../widgets/models/FilterOptionModel';
import { Theme } from '../themes/default';
import { ClipLoader } from 'react-spinners';
import { StyledRosterContainer } from '../roster/RosterContainer';

interface Props {
  trackerStore: TrackerStore;
  profile: UserModel;
  className?: string;
}

@observer
export class Tracker extends React.Component<Props> {
  async componentDidMount() {
    if (this.props.trackerStore.airmen.length === 0) {
      await this.props.trackerStore.hydrate(this.props.profile.siteId || UnfilteredValue);
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        {
          this.props.trackerStore.loading &&
          <div className="loader">
            <ClipLoader color={Theme.yellow} size={100}/>
          </div>
        }
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
              notification="Please select a site first."
            />
            <TopLevelFilter
              id="flight-filter"
              label="FLIGHT"
              unfilteredOptionLabel="All Flights"
              value={this.props.trackerStore.flightId}
              callback={this.props.trackerStore.setFlightId}
              options={this.props.trackerStore.flightOptions}
              notification="Please select a squadron first."
            />
          </div>
          <div>
            <StyledLegend/>
          </div>
          <StyledRosterContainer trackerStore={this.props.trackerStore}/>
          {/*<StyledRoster trackerStore={this.props.trackerStore}/>*/}
        </div>
        {
          !this.props.trackerStore.selectedAirman.isEmpty &&
          <StyledSidePanel
            trackerStore={this.props.trackerStore}
            sidePanelStore={this.props.trackerStore.sidePanelStore}
          />
        }
        {
          this.props.trackerStore.pendingDeleteEvent &&
          <StyledDeleteEventPopup
            event={this.props.trackerStore.pendingDeleteEvent}
            cancelPendingDeleteEvent={this.props.trackerStore.cancelPendingDelete}
            confirmPendingDeleteEvent={this.props.trackerStore.executePendingDelete}
          />
        }
      </div>
    );
  }
}

export const StyledTracker = styled(Tracker)`
  margin-left: 3rem;
  padding: 0.5rem;
  display: flex;
  color: white;
  
  .loader {
    position: fixed;
    background: ${props => props.theme.dark};
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 999;
    
    & > * {
      position: fixed; 
      top: 50%; 
      left: 47%;
    }
  }
  
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
    width: 75%;
    min-width: 1400px;
  }
 `;
