import * as React from 'react';
import AirmanModel from '../airman/models/AirmanModel';
import { Moment } from 'moment';
import styled from 'styled-components';
import * as classNames from 'classnames';
import EventModel from '../event/EventModel';

interface Props {
  airman: AirmanModel;
  week: Moment[];
  className?: string;
}

const dayHasEvent = (day: Moment, events: EventModel[]) => {
  const matchedEvents: EventModel[] = events.filter((event) => day.isSame(event.startTime, 'day'));
  return matchedEvents.length > 0;
};

export const AvailabilityOverview = (props: Props) => {
  const {airman, week} = props;
  return (
    <td className={classNames(props.className, 'planner-row')}>
      {week.map((day, dayIndex) => {
        return dayHasEvent(day, airman.events) ?
          <span className="unavailable" key={dayIndex}>&nbsp;</span> :
          <span key={dayIndex} className="available">&nbsp;</span>;
      })}
    </td>
  );
};

export default styled(AvailabilityOverview)`
  span {
    border: 1px solid ${props => props.theme.graySteel};
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    
    &.unavailable {
      background: ${props => props.theme.graySteel};
    }
  }
`;