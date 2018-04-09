import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { TrackerStore } from './stores/TrackerStore';
import { StyledSidePanel } from './SidePanel';
import { StyledLegend } from '../roster/Legend';
import { UserModel } from '../profile/models/ProfileModel';
import { UnfilteredValue } from '../widgets/models/FilterOptionModel';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { StyledRosterContainer } from '../roster/RosterContainer';
import { StyledDeleteEventPopup } from '../event/DeleteEventPopup';
import { StyledLocationFilters } from '../widgets/LocationFilters';

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
    const {locationFilterStore, sidePanelStore} = trackerStore;
    return (
      <div className={className}>
        {trackerStore.loading && <StyledLoadingOverlay/>}
        <div className="main">
          <StyledLocationFilters locationFilterStore={locationFilterStore}/>
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
  
  .main {
    width: 1400px;
    display: flex;
    flex-direction: column;
  }
  
  .filters {
    width: 50%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
 `;
