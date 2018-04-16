import * as React from 'react';
import { Moment } from 'moment';
import * as classNames from 'classnames';
import { AppointmentIcon } from '../icons/AppointmentIcon';
import { LeaveIcon } from '../icons/LeaveIcon';
import { MissionIcon } from '../icons/MissionIcon';
import { AvailableIcon } from '../icons/AvailableIcon';
import { findEventsForDay } from '../utils/eventUtil';
import styled from 'styled-components';
import { EventModel, EventType } from '../event/models/EventModel';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { TabType } from '../tracker/stores/SidePanelStore';
import { TDYDeploymentIcon } from '../icons/TDYDeploymentIcon';
import { observer } from 'mobx-react';

interface Props {
  week: Moment[];
  trackerStore: TrackerStore;
  airman: AirmanModel;
  className?: string;
}

const renderEventType = (type: EventType, key: number, event?: EventModel) => {
  switch (type) {
    case EventType.Appointment:
      return <AppointmentIcon key={key} />;
    case EventType.Mission:
      return event && <MissionIcon key={key} title={event.title.substring(0, 3)} viewBox="0 2 36 25"/>;
    case EventType.Leave:
      return <LeaveIcon key={key} />;
    case EventType.TDY_DEPLOYMENT:
      return <TDYDeploymentIcon key={key} />;
    default:
      return null;
  }
};

const renderEvents = (day: Moment,
                      events: EventModel[],
                      key: number,
                      airman: AirmanModel,
                      trackerStore: TrackerStore) => {
  const matchedEvents = findEventsForDay(events, day);
  if (matchedEvents.length > 0) {
    const eventType = matchedEvents.map(event => event.type);

    if (eventType.includes(EventType.Mission)) {
      const event = matchedEvents.find(event => event.type === EventType.Mission);
      return renderEventType(EventType.Mission, key, event);
    }

    return renderEventType(matchedEvents[0].type, key);
  } else {
    return (
      <AvailableIcon
        key={key}
        onClick={(e: any) => {
          e.stopPropagation();
          trackerStore.newEvent(airman, day);
        }}
      />
    );
  }
};

export const Planner = observer((props: Props) => {
  const {airman, week, trackerStore} = props;
  return (
    <div
      className={classNames(props.className, 'planner-row', 'tr')}
      onClick={() => trackerStore.setSelectedAirman(airman, TabType.AVAILABILITY)}
    >
      <span className="blank"/>
      <div>
        {week.map((day, index) => renderEvents(
          day,
          trackerStore.getEventsByAirmanId(airman.id),
          index,
          airman,
          trackerStore))
        }
      </div>
      <span className="blank"/>
    </div>
  );
});

export const StyledPlanner = styled(Planner)`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  width: 100%;
  
  div {
    display: flex;
    justify-content: space-between;
    flex-grow: 2;
  }
  
  .blank {
    width: 30px;
  }
`;
