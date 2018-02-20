import * as React from 'react';
import { EventModel, EventType } from '../event/models/EventModel';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { LookingGlass } from '../icons/LookingGlass';

interface Props {
  event: EventModel;
  editEvent: (event: EventModel) => void;
  className?: string;
}

export const AvailabilityTile = observer((props: Props) => {
  return (
    <div className={props.className} onClick={() => props.editEvent(props.event)}>
      <div className="event-title">
        <span>{props.event.title}</span>
        {
          props.event.type === EventType.Mission &&
          <Link to={`/crew/${props.event.id}`}>
            <LookingGlass/>
          </Link>
        }
      </div>
      <div className="event-description">
        <span>{`${props.event.startTime.format('HHmm')}L - ${props.event.endTime.format('HHmm')}L`}</span>
        <span>{props.event.description}</span>
      </div>
    </div>
  );
});

export const StyledAvailabilityTile = styled(AvailabilityTile)`
  background: ${props => props.theme.blueSteel};
  padding: 1px;
  margin: 0.5rem 0;
  cursor: pointer;
  
  & > div {
    display: flex;
    justify-content: space-between;
    padding: 0.35rem;
  }
    
  &:hover {
    background: ${props => props.theme.hoverBlueSteel};
  }
  
  .event-description {
    background: ${props => props.theme.lighter};
    font-size: 12px;
  }
`;