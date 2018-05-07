import * as React from 'react';
import { Moment } from 'moment';
import * as classNames from 'classnames';
import { AvailableIcon } from '../icons/AvailableIcon';
import styled from 'styled-components';
import { EventModel, EventType } from '../event/models/EventModel';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { SidePanelStore, TabType } from '../tracker/stores/SidePanelStore';
import { inject, observer } from 'mobx-react';
import { PlannerStore } from './stores/PlannerStore';
import { findEventsForDay } from '../utils/eventUtil';
import { AppointmentIcon } from '../icons/AppointmentIcon';
import { MissionIcon } from '../icons/MissionIcon';
import { LeaveIcon } from '../icons/LeaveIcon';
import { TDYDeploymentIcon } from '../icons/TDYDeploymentIcon';
import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { OffDayIcon } from '../icons/OffDayIcon';
import { SidePanelActions } from '../tracker/SidePanelActions';

interface Props {
  trackerStore?: TrackerStore;
  plannerStore?: PlannerStore;
  sidePanelStore?: SidePanelStore;
  availabilityStore?: AvailabilityStore;
  sidePanelActions?: SidePanelActions;
  airman: AirmanModel;
  className?: string;
}

@observer
export class Planner extends React.Component<Props> {
  newEvent = async (airman: AirmanModel, date: Moment) => {
    await this.props.sidePanelActions!.openSidePanel(airman, TabType.AVAILABILITY, date);
  }

  render() {
    const {airman, plannerStore, trackerStore} = this.props;
    const {getEventsByAirmanId} = trackerStore!;
    const airmanEvents = getEventsByAirmanId(airman.id);
    return (
      <div className={classNames(this.props.className, 'planner-row', 'tr')}>
        <span className="blank"/>
        <div>
          {
            plannerStore!.plannerWeek.map((day, index) => {
              return renderEvents(day, airmanEvents, index, airman, this.newEvent);
            })
          }
        </div>
        <span className="blank"/>
      </div>
    );
  }
}

const renderEventType = (type: EventType, key: number, event?: EventModel) => {
  switch (type) {
    case EventType.Appointment:
      return <AppointmentIcon key={key}/>;
    case EventType.Mission:
      return event && <MissionIcon key={key} title={event.title.substring(0, 3)} viewBox="0 2 36 25"/>;
    case EventType.Leave:
      return <LeaveIcon key={key}/>;
    case EventType.TDY_DEPLOYMENT:
      return <TDYDeploymentIcon key={key}/>;
    default:
      return null;
  }
};

const renderEvents = (
  day: Moment, events: EventModel[], key: number, airman: AirmanModel, newEvent: any) => {
  const matchedEvents = findEventsForDay(events, day);
  if (matchedEvents.length > 0) {
    const eventType = matchedEvents.map(event => event.type);

    if (eventType.includes(EventType.Mission)) {
      const event = matchedEvents.find(e => e.type === EventType.Mission);
      return renderEventType(EventType.Mission, key, event);
    }

    return renderEventType(matchedEvents[0].type, key);
  } else {
    if (airman.isAvailableForWork(day)) {
      return (
        <AvailableIcon
          key={key}
          onClick={(e: any) => {
            e.stopPropagation();
            newEvent(airman, day);
          }}
        />
      );
    } else {
      return (
        <OffDayIcon
          key={key}
          onClick={(e: any) => {
            e.stopPropagation();
            newEvent(airman, day);
          }}
        />
      );
    }
  }
};

export const StyledPlanner =
  inject(
    'trackerStore',
    'plannerStore',
    'sidePanelStore',
    'availabilityStore',
    'sidePanelActions'
  )(styled(Planner)`
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    width: 100%;
    
    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-grow: 2;
    }
    
    .blank {
      width: 30px;
    }
`);
