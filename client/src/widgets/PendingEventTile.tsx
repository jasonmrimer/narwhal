import styled from 'styled-components';
import * as React from 'react';
import { EventModel } from '../event/models/EventModel';
import { AirmanModel } from '../airman/models/AirmanModel';
import { SiteModel } from '../site/models/SiteModel';
import { SidePanelActions } from '../tracker/SidePanelActions';
import { inject } from 'mobx-react';
import { TabType } from '../tracker/stores/SidePanelStore';

interface Props {
  event: EventModel;
  airman: AirmanModel;
  site: SiteModel;
  sidePanelActions?: SidePanelActions;
  className?: string;
}

export class PendingEventTile extends React.Component<Props> {
  render() {
    const { event, airman, site } = this.props;
    const squadron = site.squadrons.find(s => s.id === airman.squadronId);
    const flight = squadron!.flights.find(f => f.id === airman.flightId);

    return (
      <div
        className={this.props.className}
        onClick={async () => this.props.sidePanelActions!.openFromPendingEvent(
          airman,
          TabType.AVAILABILITY,
          event.startTime
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
  'sidePanelActions'
)(styled(PendingEventTile)`
      padding: 0.75rem 1rem;
     .airman-name { 
      font-weight: 500;
     }
`);