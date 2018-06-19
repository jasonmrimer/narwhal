import styled from 'styled-components';
import * as React from 'react';
import { EventModel } from '../event/models/EventModel';
import { AirmanModel } from '../airman/models/AirmanModel';
import { SiteModel } from '../site/models/SiteModel';

interface Props {
  event: EventModel;
  airman: AirmanModel;
  site: SiteModel;
  className?: string;
}

export class PendingEventTile extends React.Component<Props> {

  render() {
    const squadron = this.props.site.squadrons.find(s => s.id === this.props.airman.squadronId);
    const flight = squadron!.flights.find(f => f.id === this.props.airman.flightId);
    return (
      <div className={this.props.className}>
        <div className="airman">
        <span className="airman-name">
          {this.props.airman.firstName} {this.props.airman.lastName}, </span>
          {squadron!.name} {flight!.name}
        </div>
        <div className="event">
          {this.props.event.title}
        </div>
      </div>
    );
  }
}

export const StyledPendingEventTile = styled(PendingEventTile)`
      padding: 0.75rem 1rem;
     .airman-name { 
      font-weight: 500;
     }
`;