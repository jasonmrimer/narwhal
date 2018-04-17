import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { TrackerStore } from './stores/TrackerStore';
import { StyledSidePanel } from './SidePanel';
import { StyledLegend } from '../roster/Legend';
import { UnfilteredValue } from '../widgets/models/FilterOptionModel';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { StyledRosterContainer } from '../roster/RosterContainer';
import { StyledLocationFilters } from '../widgets/LocationFilters';
import { StyledDeletePopup } from '../widgets/DeletePopup';
import { ProfileModel } from '../profile/models/ProfileModel';

interface Props {
  trackerStore: TrackerStore;
  profile: ProfileModel;
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
          <StyledDeletePopup
            item={trackerStore.availabilityStore.pendingDeleteEvent}
            onConfirm={trackerStore.availabilityStore.executePendingDelete}
            onCancel={trackerStore.availabilityStore.cancelPendingDelete}
          />
        }
        {
          trackerStore.currencyStore.pendingDeleteSkill &&
          <StyledDeletePopup
            item={trackerStore.currencyStore.pendingDeleteSkill}
            onConfirm={trackerStore.currencyStore.removeSkill}
            onCancel={trackerStore.currencyStore.setPendingDeleteSkill}
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
