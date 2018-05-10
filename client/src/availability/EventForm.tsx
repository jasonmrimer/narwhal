import * as React from 'react';
import { EventType } from '../event/models/EventModel';
import { StyledAppointmentForm } from '../event/AppointmentForm';
import { StyledLeaveForm } from '../event/LeaveForm';
import { StyledMissionForm } from '../event/MissionForm';
import { StyledTDYDeploymentForm } from '../event/TDYDeploymentForm';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AvailabilityStore } from './stores/AvailabilityStore';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

interface Props {
  availabilityStore?: AvailabilityStore;
  trackerStore?: TrackerStore;
}

@observer
export class EventForm extends React.Component<Props> {
  render() {
    const {availabilityStore, trackerStore} = this.props;
    switch (availabilityStore!.eventFormType) {
      case EventType.Appointment:
        return (
          <StyledAppointmentForm
            airmanId={trackerStore!.selectedAirman.id}
            event={availabilityStore!.event}
          />
        );
      case EventType.Leave:
        return (
          <StyledLeaveForm
            airmanId={trackerStore!.selectedAirman.id}
            event={availabilityStore!.event}
          />
        );
      case EventType.Mission:
        return (
          <StyledMissionForm
            airmanId={trackerStore!.selectedAirman.id}
            event={availabilityStore!.event}
          />
        );
      case EventType.TDY_DEPLOYMENT:
        return (
          <StyledTDYDeploymentForm
            airmanId={trackerStore!.selectedAirman.id}
            event={availabilityStore!.event}
          />
        );
      default:
        return null;

    }
  }
}

export const StyledEventForm = inject('availabilityStore', 'trackerStore')(styled(EventForm)``);