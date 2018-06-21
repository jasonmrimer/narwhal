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

export const PendingEventTile = (props: Props) => {
  const squadron = props.site.squadrons.find(s => s.id === props.airman.squadronId);
  const flight = squadron!.flights.find(f => f.id === props.airman.flightId);
  return (
    <div className={props.className}>
      <div className="airman">
        <span className="airman-name">
          {props.airman.firstName}
          {props.airman.lastName},
          </span>
        {squadron!.name}
        {flight!.name}
      </div>
      <div className="event">
        {props.event.title}
      </div>
    </div>
  );
  }

export const StyledPendingEventTile = styled(PendingEventTile)`
  
`;