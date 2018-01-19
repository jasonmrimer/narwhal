import * as React from 'react';
import EventModel from '../event/EventModel';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import DeleteIcon from '../icons/DeleteIcon';

interface Props {
  event: EventModel;
  deleteEvent: (id: number) => void;
  className?: string;
}

export const AirmanEvent = observer((props: Props) => {
  return (
    <div className={props.className}>
      <div className="event-title">
        <span>{props.event.startTime.format('DD MMM YY').toUpperCase()}</span>
        <span>{props.event.title}</span>
        <button className="delete" onClick={() => props.deleteEvent(props.event.id || -1)}>
          <DeleteIcon />
        </button>
      </div>
      <div className="event-description">
        <span>{`${props.event.startTime.format('HHmm')}Z - ${props.event.endTime.format('HHmm')}Z`}</span>
        <span>{props.event.description}</span>
      </div>
    </div>
  );
});

export default styled(AirmanEvent)`
  background: ${props => props.theme.blueSteel};
  padding: 1px;
  margin: 0.5rem 0;
  
  & > div {
    display: flex;
    justify-content: space-between;
    padding: 0.35rem;
  }
  
  .event-description {
    background: ${props => props.theme.lighter};
    font-size: 12px;
  }
  
  .delete {
    background: ${props => props.theme.blueSteel};
  }
`;