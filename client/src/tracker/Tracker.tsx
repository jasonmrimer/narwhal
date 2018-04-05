import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { TrackerStore } from './stores/TrackerStore';
import { TopLevelFilter } from '../widgets/Filter';
import { StyledSidePanel } from './SidePanel';
import { StyledLegend } from '../roster/Legend';
import { UserModel } from '../profile/models/ProfileModel';
import { UnfilteredValue } from '../widgets/models/FilterOptionModel';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { StyledRosterContainer } from '../roster/RosterContainer';
import { StyledDropdown } from '../widgets/Dropdown';
import { StyledDeleteEventPopup } from '../event/DeleteEventPopup';
import { caret } from '../utils/StyleUtils';

interface Props {
  trackerStore: TrackerStore;
  profile: UserModel;
  className?: string;
}

@observer
export class Tracker extends React.Component<Props> {
  async componentDidMount() {
    await this.props.trackerStore.hydrate(this.props.profile.siteId || UnfilteredValue);
  }

  render() {
    const {trackerStore, className} = this.props;
    const {trackerFilterStore, sidePanelStore} = trackerStore;
    return (
      <div className={className}>
        {trackerStore.loading && <StyledLoadingOverlay/>}
        <div className="main">
          <div className="filters">
            <div id="site-filter-container">
              <label htmlFor="site-filter">SITE</label>
              <br/>
              <StyledDropdown
                id="site-filter"
                name="siteId"
                options={trackerFilterStore.siteOptions}
                value={trackerFilterStore.selectedSite}
                onChange={async (e: any) => {
                  await trackerFilterStore.setSelectedSite(Number(e.target.value));
                }}
              />
            </div>
            <TopLevelFilter
              id="squadron-filter"
              label="SQUADRON"
              unfilteredOptionLabel="All Squadrons"
              value={trackerFilterStore.selectedSquadron}
              callback={trackerFilterStore.setSelectedSquadron}
              options={trackerFilterStore.squadronOptions}
              notification="Please select a site first."
            />
            <TopLevelFilter
              id="flight-filter"
              label="FLIGHT"
              unfilteredOptionLabel="All Flights"
              value={trackerFilterStore.selectedFlight}
              callback={trackerFilterStore.setSelectedFlight}
              options={trackerFilterStore.flightOptions}
              notification="Please select a squadron first."
            />
          </div>
          <div>
            <StyledLegend/>
          </div>
          <StyledRosterContainer trackerStore={trackerStore}/>
        </div>
        {
          !trackerStore.selectedAirman.isEmpty &&
          <StyledSidePanel
            trackerStore={trackerStore}
            sidePanelStore={sidePanelStore}
          />
        }
        {
          trackerStore.availabilityStore.pendingDeleteEvent &&
          <StyledDeleteEventPopup
            event={trackerStore.availabilityStore.pendingDeleteEvent}
            cancelPendingDeleteEvent={trackerStore.availabilityStore.cancelPendingDelete}
            confirmPendingDeleteEvent={trackerStore.availabilityStore.executePendingDelete}
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
    min-width: 20%;
    display: inline-block;
    position: relative;
    float: left;
    z-index: 9;
    margin: 0 32px 0 0;
    
      &:after {
    content: ' ';
    background: ${props => caret(false)};
    right: 0;
    height: 14px;
    width: 20px;
    top: 45px;
    position: absolute;
    pointer-events: none;
  }
    
  }
  
  #site-filter {
    background: transparent;
    display: block;
    width: 100%;
    height: 50px;
    float: right;
    margin: 5px 0px;
    font-size: 16px;
    line-height: 1.75;
    border: none;
    border-bottom: 1px solid #fff;
    color: #fff;
    border-radius: 0;
    cursor: pointer;
  }
  
  .main {
    width: 1400px;
  }
 `;
