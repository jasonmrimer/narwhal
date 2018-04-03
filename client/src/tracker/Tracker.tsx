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
            <TopLevelFilter
              id="site-filter"
              label="SITE"
              unfilteredOptionLabel="All Sites"
              value={trackerFilterStore.selectedSite}
              callback={trackerFilterStore.setSelectedSite}
              options={trackerFilterStore.siteOptions}
            />
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
  
  .main {
    width: 1400px;
  }
 `;
