import * as React from 'react';
import { Moment } from 'moment';
import * as classNames from 'classnames';
import EventModel, { EventType } from '../event/models/EventModel';
import AppointmentIcon from '../icons/AppointmentIcon';
import LeaveIcon from '../icons/LeaveIcon';
import MissionIcon from '../icons/MissionIcon';
import AvailableIcon from '../icons/AvailableIcon';
import { doesDayHaveEvent } from '../utils/eventUtil';
import styled from 'styled-components';

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
  const matchedEvents = events.filter(event => doesDayHaveEvent(day, event));
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
      <span className="blank"/>
      <div>
       {week.map((day, index) => renderEvents(day, events, index))}
      </div>
      <span className="blank"/>
    </td>
  );
};

export default styled(Planner)`
  div {
    display: flex;
    justify-content: space-between;
    flex-grow: 2;
  }
  .blank {
    width: 1.8rem;
  }
`;
