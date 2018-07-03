import * as React from 'react';
import { EventModel, EventStatus, EventType } from '../event/models/EventModel';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { LookingGlass } from '../icons/LookingGlass';

interface Props {
  event: EventModel;
  editEvent: (event: EventModel) => void;
  className?: string;
}

@observer
export class AvailabilityTile extends React.Component<Props> {
  render() {
    const {event, editEvent, className} = this.props;
    return (
      <div className={className} onClick={() => editEvent(event)}>
        <div className="event-title">

          {this.EventStatusTag(event)}

          <span>{event.title}</span>

          {
            event.type === EventType.Mission &&
            <Link to={`/dashboard/crew/${event.id}`} className="mission-list">
              <LookingGlass/> Mission List
            </Link>
          }
        </div>
        <div className="event-description">
          <span>{`${event.startTime.format('HHmm')}L - ${event.endTime.format('HHmm')}L`}</span>
          <span>{event.description}</span>
        </div>
      </div>
    );
  }

  private EventStatusTag = (event: EventModel) => {
    if (event.status === EventStatus.Pending) {
      return (
        <span className="event-status">[PENDING]</span>
      );
    } else if (event.status === EventStatus.Denied) {
      return (
        <span className="event-status">[DENIED]</span>
      );
    }
    return null;
  }
}

export const StyledAvailabilityTile = styled(AvailabilityTile)`
  background: ${props => props.theme.blueSteel};
  border-radius: 0.25rem 0.25rem 0 0;
  padding: 1px;
  margin: 0.5rem 0;
  cursor: pointer;
  
  & > div {
    display: flex;
    padding: 0.35rem;
  }
    
  &:hover {
    background: ${props => props.theme.hoverBlueSteel};
    border-radius: 0.25rem 0.25rem 0 0;
  }
  
  .event-status {
    padding-right: 0.5rem;
  }
  
  .event-title {
    background: ${props => props.event.status === EventStatus.Pending ? props.theme.purpleSplash : 'none'};
    background: ${props => props.event.status === EventStatus.Denied ? props.theme.redSteel : 'none'};
  }
  
  .event-description {
    background: ${props => props.theme.lighter};
    justify-content: space-between;
    font-size: 12px;
  }
  
  .mission-list {
    text-decoration: none;
    color: ${props => props.theme.fontColor};
    margin-bottom: 1px;
    
    &:hover {
      border-bottom: 1px solid white;
      margin-bottom: 0;
    }
  }
`;