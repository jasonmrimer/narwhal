import * as React from 'react';
import EventModel from '../event/models/EventModel';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import DeleteIcon from '../icons/DeleteIcon';

interface Props {
  event: EventModel;
  deleteEvent: (event: EventModel) => void;
  editEvent: (event: EventModel) => void;
  className?: string;
}

const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, props: Props) => {
  e.stopPropagation();
  props.deleteEvent(props.event);
};

export const AirmanEvent = observer((props: Props) => {
  return (
    <div className={props.className} onClick={() => props.editEvent(props.event)}>
      <div className="event-title">
        <span>{props.event.title}</span>
        <button className="delete" onClick={(e) => handleDelete(e, props)}>
          <DeleteIcon/>
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
  
  .delete {
    background: transparent;
  }
`;