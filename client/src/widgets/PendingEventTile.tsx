import styled from 'styled-components';
import * as React from 'react';
import { EventModel } from '../event/models/EventModel';
import { AirmanModel } from '../airman/models/AirmanModel';
import { SiteModel } from '../site/models/SiteModel';
import { SidePanelActions } from '../tracker/SidePanelActions';
import { TabType } from '../tracker/stores/SidePanelStore';
import { inject } from 'mobx-react';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';

interface Props {
  event: EventModel;
  airman: AirmanModel;
  site: SiteModel;
  sidePanelActions?: SidePanelActions;
  profileStore?: ProfileSitePickerStore;
}

export class PendingEventTile extends React.Component<Props> {
  render() {
    const { event, airman, site, sidePanelActions, profileStore } = this.props;
    const squadron = site.squadrons.find(s => s.id === airman.squadronId);
    const flight = squadron!.flights.find(f => f.id === airman.flightId);

    return (
      <div
        className="event-tile"
        onClick={async () => await profileStore!.performLoading(async () =>
          await sidePanelActions!.openSidePanel(
            airman,
            TabType.AVAILABILITY,
            event.startTime
          )
        )}
      >
        <div className="airman">
        <span className="airman-name">
          {airman.firstName} {airman.lastName}, </span>
          {squadron!.name} {flight!.name}
        </div>
        <div className="event">
          {event.title}
        </div>
      </div>
    );
  }
}

export const StyledPendingEventTile = inject(
  'sidePanelActions',
  'profileStore'
)(styled(PendingEventTile)`
      padding: 0.75rem 1rem;
     .airman-name { 
      font-weight: 500;
     }
`);