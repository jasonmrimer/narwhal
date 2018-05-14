import * as React from 'react';
import { EventModel } from '../event/models/EventModel';
import styled from 'styled-components';

interface Props {
  event: EventModel;
  className?: string;
}

export const EventCreationInfo = (props: Props) => {
  const {event, className} = props;

  return (
    <div className={className}>
      <h3>Created by</h3>
      <div className="event-creator">{event.createdBy!}</div>
      <div>{event.createdOn!.format('D MMM YY')} at {event.createdOn!.format('HHmm')}</div>
    </div>
  );
};

export const StyledEventCreationInfo = styled(EventCreationInfo)`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  
  div {
    font-size: 0.75rem;
  }
  
  .event-creator {
    margin: 0.25rem 0;
    color: ${props => props.theme.fontColor};
  }
`;
