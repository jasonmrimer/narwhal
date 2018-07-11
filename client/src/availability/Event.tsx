import * as React from 'react';
import { AvailabilityActions } from './AvailabilityActions';
import { inject, observer } from 'mobx-react';
import { Moment } from 'moment';
import { findEventsForDay } from '../utils/eventUtil';
import { StyledAvailabilityTile } from './AvailabilityTile';
import { AvailabilityStore } from './stores/AvailabilityStore';
import styled from 'styled-components';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { BabyPlusIcon } from '../icons/BabyPlusIcon';

interface Props {
  availabilityActions?: AvailabilityActions;
  availabilityStore?: AvailabilityStore;
  profileStore?: ProfileSitePickerStore;
  day: Moment;
}

@observer
export class Event extends React.Component<Props> {
  render() {
    const {availabilityActions, day} = this.props;
    return (
      <div>
        <div
          className="event-date"
          onClick={() => availabilityActions!.openEventFormForDay(day)}
        >
          <span>{day.format('ddd, DD MMM YY').toUpperCase()}</span>
          <span className="add-event-on-date">{<BabyPlusIcon/>} Add Event</span>
        </div>
        {this.scheduledEventsForDate(day)}
      </div>
    );
  }

  private scheduledEventsForDate = (day: Moment) => {
    let events;
    const {availabilityStore, profileStore} = this.props;
    const eventsForDay = findEventsForDay(availabilityStore!.airmanEvents, day);
    events = <div className="event-name">No Events Scheduled</div>;

    if (eventsForDay.length >= 1) {
      events = eventsForDay.map((event, index) => {
        return (
          <StyledAvailabilityTile
            key={index}
            event={event}
            editEvent={() => {
              availabilityStore!.openEditEventForm(event);
            }}
            profile={profileStore!.profile!}
          />
        );
      });
    }

    return events;
  }
}

export const StyledEvent = inject(
  'availabilityActions',
  'availabilityStore',
  'profileStore'
)(styled(Event)`

`);