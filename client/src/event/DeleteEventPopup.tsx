import * as React from 'react';
import { EventModel } from './models/EventModel';
import { observer } from 'mobx-react/custom';
import styled from 'styled-components';

interface Props {
  event: EventModel;
  cancelPendingDeleteEvent: (event: null) => void;
  confirmPendingDeleteEvent: () => void;
  className?: string;
}

export const DeleteEventPopup = observer((props: Props) => {
  const event = props.event!;
  const format = 'DD MMM YY HH:mm';

  return (
    <div className={props.className}>
      <div className="delete-confirmation">
        <div>REMOVE EVENT</div>
        <span>Remove {event.title}, from {event.startTime.format(format)} - {event.endTime.format(format)}?</span>
        <span>
          <button className="cancel" onClick={() => props.cancelPendingDeleteEvent(null)}>CANCEL</button>
          <button className="confirm" onClick={props.confirmPendingDeleteEvent}>REMOVE</button>
        </span>
      </div>
    </div>
  );
});

export const StyledDeleteEventPopup = styled(DeleteEventPopup)`
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-size: 1.25rem;
  z-index: 1001;
  
  .delete-confirmation {
    background: ${props => props.theme.blueSteel};
    width: 500px;
    display: flex;
    flex-direction: column;
    position: relative; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%);
    padding: 2px;
    
    & > div {
      background: ${props => props.theme.dark};
      padding: 0.45rem;
      font-size: 1rem;
      border-top-left-radius: 2%;      
      border-top-right-radius: 2%;      
    }
    
    span {
      padding: 1rem;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    } 
    
    button {
      padding: 0.75rem 2.5rem;
      margin-left: 0.5rem;
      font-weight: 500;
      background: none;
      color: ${props => props.theme.fontColor};
      border: 1px solid ${props => props.theme.fontColor}; 
      border-radius: 5%;
      
      &:hover {
        background: ${props => props.theme.fontColor};
        color: ${props => props.theme.darkest};
      }
    }
  }
  `;