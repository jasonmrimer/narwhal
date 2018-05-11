import * as React from 'react';
import { EventModel, EventType } from '../../event/models/EventModel';
import { MissionIcon } from '../../icons/MissionIcon';
import { AppointmentIcon } from '../../icons/AppointmentIcon';
import { LeaveIcon } from '../../icons/LeaveIcon';
import { TDYDeploymentIcon } from '../../icons/TDYDeploymentIcon';

export class DailyEvents extends Array<EventModel> {
  constructor(events: EventModel[]) {
    super(...events);
  }

  isEmpty = () => {
    return this.length === 0;
  }

  renderEvent = () => {
    if (this.hasMission()) {
      return <MissionIcon title={this.getMission().title.substring(0, 3)} viewBox="0 2 36 25"/>;
    } else {
      switch (this[0].type) {
        case EventType.Appointment:
          return <AppointmentIcon/>;
        case EventType.Leave:
          return <LeaveIcon/>;
        case EventType.TDY_DEPLOYMENT:
          return <TDYDeploymentIcon/>;
        default:
          return null;
      }
    }
  }

  private hasMission = () => {
    return this.map(e => e.type).includes(EventType.Mission);
  }

  private getMission = () => {
    return this.find(e => e.type === EventType.Mission)!;
  }
}