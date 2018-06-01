import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { TrackerStore } from './stores/TrackerStore';
import { StyledSidePanel } from './SidePanel';
import { StyledLegend } from '../roster/Legend';
import { StyledRosterContainer } from '../roster/RosterContainer';
import { StyledLocationFilters } from '../widgets/LocationFilters';
import { StyledDeletePopup } from '../widgets/popups/DeletePopup';
import { ProfileModel } from '../profile/models/ProfileModel';
import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { TrackerActions } from './TrackerActions';
import { EventActions } from '../event/EventActions';
import { SkillActions } from '../skills/SkillActions';

interface Props {
  trackerStore?: TrackerStore;
  availabilityStore?: AvailabilityStore;
  currencyStore?: CurrencyStore;
  eventActions?: EventActions;
  trackerActions?: TrackerActions;
  skillActions?: SkillActions;
  profile: ProfileModel;
  className?: string;
}

@observer
export class Tracker extends React.Component<Props> {
  render() {
    const {
      trackerStore,
      availabilityStore,
      currencyStore,
      className,
      eventActions,
      trackerActions,
      skillActions
    } = this.props;
    return (
      <div className={className}>
        <div className="main">
          <StyledLocationFilters
            refreshAirmen={trackerActions!.getAirmenBySite}
          />
          <div>
            <StyledLegend/>
          </div>
          <StyledRosterContainer/>
        </div>
        {
          !trackerStore!.selectedAirman.isEmpty &&
          <StyledSidePanel/>
        }
        {
          availabilityStore!.pendingDeleteEvent &&
          <StyledDeletePopup
            item={availabilityStore!.pendingDeleteEvent!}
            onConfirm={eventActions!.executePendingDelete}
            onCancel={availabilityStore!.cancelPendingDelete}
          />
        }
        {
          currencyStore!.pendingDeleteSkill &&
          <StyledDeletePopup
            item={currencyStore!.pendingDeleteSkill!}
            onConfirm={skillActions!.executePendingDelete}
            onCancel={currencyStore!.cancelPendingDelete}
          />
        }
      </div>
    );
  }
}

export const StyledTracker =
  inject(
    'trackerStore',
    'availabilityStore',
    'currencyStore',
    'locationFilterStore',
    'skillFormStore',
    'eventActions',
    'trackerActions',
    'skillActions'
  )(styled(Tracker)`
    margin-left: 3rem;
    padding: 0.5rem;
    display: flex;
  
    .main {
      width: 1400px;
      display: flex;
      flex-direction: column;
    }
  
    .filters {
      width: 35%;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
  }
 `);
