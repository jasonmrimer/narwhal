import * as React from 'react';
import { EventModel, EventStatus, EventType } from '../../event/models/EventModel';
import { MissionIcon } from '../../icons/MissionIcon';
import { AppointmentIcon } from '../../icons/AppointmentIcon';
import { LeaveIcon } from '../../icons/LeaveIcon';
import { TDYDeploymentIcon } from '../../icons/TDYDeploymentIcon';
import { PendingLeaveIcon } from '../../icons/PendingLeaveIcon';
import { PendingAppointmentIcon } from '../../icons/PendingAppointmentIcon';
import { AvailableIcon } from '../../icons/AvailableIcon';

export class DailyEvents extends Array<EventModel> {
  constructor(events: EventModel[]) {
    super(...events);
  }

  isEmpty = () => {
    return this.length === 0;
  }

  renderEvent = () => {
    if (this.hasMission()) {
      return (
        <MissionIcon
          title={this.getMission().title.substring(0, 3)}
          viewBox="0 2 36 25"
          styled={{marginTop: '0.35rem'}}
        />
      );
    } else {
      return this.renderSwitch();
    }
  }

  private hasMission = () => {
    return this.map(e => e.type).includes(EventType.Mission);
  }

  private getMission = () => {
    return this.find(e => e.type === EventType.Mission)!;
  }

  private renderSwitch = () => {
    let i = 0;

    while (i < this.length) {
      if (this[i].status !== EventStatus.Denied) {
        switch (this[i].type) {
          case EventType.Appointment:
            return this[i].status === EventStatus.Pending ? <PendingAppointmentIcon/> : <AppointmentIcon/>;
          case EventType.Leave:
            return this[i].status === EventStatus.Pending ? <PendingLeaveIcon/> : <LeaveIcon/>;
          case EventType.TDY_DEPLOYMENT:
            return <TDYDeploymentIcon/>;
          default:
            return;
        }
      }
      i++;
    }
    return <AvailableIcon/>;
  }
}