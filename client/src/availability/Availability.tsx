import * as React from 'react';
import styled from 'styled-components';
import { Moment } from 'moment';
import { EventModel, EventType } from '../event/models/EventModel';
import { StyledAvailabilityTile } from './AvailabilityTile';
import { observer } from 'mobx-react';
import { NextIcon } from '../icons/NextIcon';
import { doesDayHaveEvent } from '../utils/eventUtil';
import { BackIcon } from '../icons/BackIcon';
import { AvailabilityStore } from './stores/AvailabilityStore';
import { PlannerStore } from '../roster/stores/PlannerStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { StyledRadioButtons } from '../widgets/RadioButtons';
import { StyledAppointmentForm } from '../event/AppointmentForm';
import { StyledLeaveForm } from '../event/LeaveForm';
import { StyledMissionForm } from '../event/MissionForm';
import { MissionStore } from '../mission/stores/MissionStore';
import { StyledBackButton } from '../widgets/BackButton';

interface Props {
  selectedAirman: AirmanModel;
  availabilityStore: AvailabilityStore;
  missionStore: MissionStore;
  plannerStore: PlannerStore;
  className?: string;
}

@observer
export class Availability extends React.Component<Props> {
  componentDidMount() {
    this.props.availabilityStore.closeEventForm();
  }

  componentWillReceiveProps() {
    this.props.availabilityStore.closeEventForm();
  }

  render() {
    return (
      <div className={this.props.className}>
        {
          this.props.availabilityStore.shouldShowEventForm ?
            this.renderEventFormContainer() :
            this.renderAvailability()
        }
      </div>
    );
  }

  /* tslint:disable:no-any*/
  private renderEventFormContainer = () => {
    const {availabilityStore} = this.props;
    return (
      <div>
        <StyledBackButton
          onClick={() => availabilityStore.closeEventForm()}
          text="Back to Week View"
        />

        {
          !availabilityStore.hasItem &&
          <div className="form-wrapper">
            <div>Select Event Type:</div>
            <StyledRadioButtons
              name="eventType"
              options={Object.keys(EventType).map(key => EventType[key])}
              value={availabilityStore.eventFormType}
              onChange={(e: any) => availabilityStore.openCreateEventForm(e.target.value)}
            />
          </div>
        }

        {this.renderEventForm()}
      </div>
    );
  }

  private renderEventForm() {
    const {selectedAirman, availabilityStore, missionStore} = this.props;
    switch (availabilityStore.eventFormType) {
      case EventType.Appointment:
        return (
          <StyledAppointmentForm
            airmanId={selectedAirman.id}
            appointmentFormStore={availabilityStore.appointmentFormStore}
          />
        );
      case EventType.Leave:
        return (
          <StyledLeaveForm
            airmanId={selectedAirman.id}
            leaveFormStore={availabilityStore.leaveFormStore}
          />
        );
      case EventType.Mission:
        return (
          <StyledMissionForm
            airmanId={selectedAirman.id}
            missionStore={missionStore}
            missionFormStore={availabilityStore.missionFormStore}
          />
        );
      default:
        return null;
    }
  }

  private renderAvailability = () => {
    const {selectedAirman, availabilityStore, plannerStore} = this.props;
    const week = plannerStore.sidePanelWeek;
    return (
      <div>
        <div className="event-control-row">
          <button className="add-event" onClick={() => availabilityStore.showEventForm()}>
            + Add Event
          </button>
        </div>

        <div className="nav-row">
          <button className="last-week" onClick={plannerStore.decrementSidePanelWeek}>
            <BackIcon width={12} height={12}/>
          </button>

          <h3>
            {week[0].format('DD MMM').toUpperCase()} - {week[6].format('DD MMM').toUpperCase()}
          </h3>

          <button className="next-week" onClick={plannerStore.incrementSidePanelWeek}>
            <NextIcon width={12} height={12}/>
          </button>
        </div>

        <div className="availability">
          {
            plannerStore.sidePanelWeek.map((day, index) => {
              return (
                <div id={`day-${index}`} key={index}>
                  <div className="event-date">{day.format('ddd, DD MMM YY').toUpperCase()}</div>
                  {this.scheduledEventsForDate(day, selectedAirman.events)}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  private scheduledEventsForDate = (day: Moment, events: EventModel[]) => {
    const {availabilityStore} = this.props;
    const eventsForDay = events.filter(event => doesDayHaveEvent(day, event));
    return eventsForDay.length === 0
      ? <div className="event-name">No Events Scheduled</div>
      : eventsForDay.map((event, index) => {
        return (
          <StyledAvailabilityTile
            key={index}
            event={event}
            editEvent={() => availabilityStore.openEditEventForm(event)}
          />
        );
      });
  }
}

export const StyledAvailability = styled(Availability)`
  width: 100%;
  text-align: left;

  h3 {
    font-size: 0.875rem;
    font-weight: 500;
    margin: 0;
  }
   
   .form-wrapper {
     color: ${props => props.theme.graySteel};
   }

  .event-control-row {
    display: flex;
    justify-content: flex-end;

    .add-event {
      font-size: 16px;
      margin: 0.5rem 1rem;
      color: ${props => props.theme.fontColor};
      background-color: ${props => props.theme.lighter};
      border: none;
      cursor: pointer;
     
      :hover{
        background: ${props => props.theme.fontColor};
        color: ${props => props.theme.darkest};
      }
     }
  }

  .event-date {
    text-align: left;
    font-size: 0.75rem;
    margin-top: 1.5rem;
  }

  .event-name {
    color: ${props => props.theme.graySteel};
    border-bottom: ${props => props.theme.graySteel} 1px solid;
    margin: 1.5rem 20%;
  }
  
  .nav-row {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
   
    button {
      background-color: ${props => props.theme.lighter};
      border: none;
      cursor: pointer;
    }
  }
  `;
