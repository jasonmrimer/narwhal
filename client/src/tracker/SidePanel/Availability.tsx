import * as React from 'react';
import { Moment } from 'moment';
import styled from 'styled-components';
import EventModel from '../../event/EventModel';
import AirmanEvent from '../../airman/AirmanEvent';

interface Props {
  week: Moment[];
  events: EventModel[];
  className?: string;
}

const scheduledEventForDate = (day: Moment, events: EventModel[]) => {
  const [matchedEvent]: EventModel[] = events.filter((event) => day.isSame(event.startTime, 'day'));
  return matchedEvent ? <AirmanEvent event={matchedEvent}/> : <div className="event_name">No Events Scheduled</div>;
};

export const Availability = (props: Props) => {
  const {week} = props;
  return (
    <div className={props.className}>
      <h3>
        {week[0].format('DD MMM').toUpperCase()} - {week[6].format('DD MMM').toUpperCase()}
      </h3>
      <div className="availability">
        {
          week.map((day, index) => {
            return (
              <div key={`day-${index}`}>
                <div className="event_date">{day.format('ddd, DD MMM YY').toUpperCase()}</div>
                {scheduledEventForDate(day.utc(), props.events)}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default styled(Availability)`
  width: 100%;
  text-align: center;
  
  h3 {
    font-size: 0.875rem;
    font-weight: 500;
  }
  .event_date {
    text-align: left;
    font-size: 0.75rem;
    margin-top: 1.5rem;
  }  

  .event_name {
    color: ${props => props.theme.graySteel};
    border-bottom: ${props => props.theme.graySteel} 1px solid;
    margin: 1.5rem 20%;
  }
`;
