import * as React from 'react';
import { Moment } from 'moment';
import styled from 'styled-components';
import * as classNames from 'classnames';
import EventModel, { EventType } from '../event/EventModel';
import AppointmentIcon from '../icons/AppointmentIcon';
import LeaveIcon from '../icons/LeaveIcon';
import MissionIcon from '../icons/MissionIcon';
import AvailableIcon from '../icons/AvailableIcon';

interface Props {
  events: EventModel[];
  week: Moment[];
  className?: string;
}

const renderEventType = (type: EventType, key: number) => {
  switch (type) {
    case EventType.Appointment:
      return <AppointmentIcon key={key}/>;
    case EventType.Mission:
      return <MissionIcon key={key}/>;
    case EventType.Leave:
      return <LeaveIcon key={key}/>;
    default:
      return null;
  }
};

const renderEvents = (day: Moment, events: EventModel[], key: number) => {
  const matchedEvents = events.filter(event => day.isSame(event.startTime, 'day'));
  if (matchedEvents.length > 0) {
    return renderEventType(matchedEvents[0].type, key);
  } else {
    return <AvailableIcon key={key}/>;
  }
};

export const Planner = (props: Props) => {
  const {events, week} = props;
  return (
    <td className={classNames(props.className, 'planner-row')}>
      {week.map((day, index) => renderEvents(day, events, index))}
    </td>
  );
};

export default styled(Planner)`
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