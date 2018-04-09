import * as React from 'react';
import styled from 'styled-components';
import { Moment } from 'moment';
import { EventModel, EventType } from '../event/models/EventModel';
import { StyledAvailabilityTile } from './AvailabilityTile';
import { observer } from 'mobx-react';
import { NextIcon } from '../icons/NextIcon';
import { findEventsForDay } from '../utils/eventUtil';
import { BackIcon } from '../icons/BackIcon';
import { AvailabilityStore } from './stores/AvailabilityStore';
import { PlannerStore } from '../roster/stores/PlannerStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { StyledRadioButtons } from '../widgets/RadioButtons';
import { StyledAppointmentForm } from '../event/AppointmentForm';
import { StyledLeaveForm } from '../event/LeaveForm';
import { StyledMissionForm } from '../event/MissionForm';
import { StyledBackButton } from '../widgets/BackButton';
import { StyledTDYDeploymentForm } from '../event/TDYDeploymentForm';

interface Props {
  selectedAirman: AirmanModel;
  selectedDate: Moment | null;
  createEvent: (airman: AirmanModel, date: Moment | null) => void;
  availabilityStore: AvailabilityStore;
  plannerStore: PlannerStore;
  className?: string;
}

@observer
export class Availability extends React.Component<Props> {
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

  private renderEventFormContainer = () => {
    const {availabilityStore, selectedAirman, selectedDate} = this.props;
    return (
      <div>
        <StyledBackButton
          onClick={() => availabilityStore.closeEventForm()}
          text="Back to Week View"
        />
        {
          availabilityStore.shouldShowEventTypeSelection &&
          <div className="form-wrapper">
            <div>Select Event Type:</div>
            <StyledRadioButtons
              name="eventType"
              options={Object.keys(EventType).map(key => EventType[key])}
              value={availabilityStore.eventFormType}
              onChange={(e: any) => {
                availabilityStore.openCreateEventForm(e.target.value, selectedAirman.id, selectedDate);
              }}
            />
          </div>
        }
        {this.renderEventForm()}
      </div>
    );
  }

  private renderEventForm() {
    const {selectedAirman, availabilityStore} = this.props;
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
            missionFormStore={availabilityStore.missionFormStore}
          />
        );
      case EventType.TDY_DEPLOYMENT:
        return (
          <StyledTDYDeploymentForm
            airmanId={selectedAirman.id}
            tdyDeploymentFormStore={availabilityStore.tdyDeploymentFormStore}
          />
        );
      default:
        return null;
    }
  }

  private renderAvailability = () => {
    const {availabilityStore, plannerStore, createEvent, selectedAirman} = this.props;
    const week = plannerStore.sidePanelWeek;
    return (
      <div>
        <div className="event-control-row">
          <button className="add-event" onClick={() => createEvent(selectedAirman, null)}>
            + Add Event
          </button>
        </div>

        <div className="nav-row">
          <button className="last-week" onClick={async () => await plannerStore.decrementSidePanelWeek()}>
            <BackIcon width={12} height={12}/>
          </button>

          <h3>
            {week[0].format('DD MMM').toUpperCase()} - {week[6].format('DD MMM').toUpperCase()}
          </h3>

          <button className="next-week" onClick={async () => await plannerStore.incrementSidePanelWeek()}>
            <NextIcon width={12} height={12}/>
          </button>
        </div>

        <div className="availability">
          {
            plannerStore.sidePanelWeek.map((day, index) => {
              return (
                <div id={`day-${index}`} key={index}>
                  <div
                    className="event-date"
                    onClick={() => createEvent(selectedAirman, day)}
                  >
                    <span>
                      {day.format('ddd, DD MMM YY').toUpperCase()}
                    </span>
                    <span className="add-event-on-date">
                      + Add Event
                    </span>
                  </div>
                  {this.scheduledEventsForDate(day, availabilityStore.airmanEvents)}
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
    const eventsForDay = findEventsForDay(events, day);
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
    cursor: pointer;
    height: 0.75rem;
    align-items: center;
    display: flex;
    
    :hover .add-event-on-date {
      display: inline;
      margin-left: 0.5rem;
      margin-top: 0;
      padding: 0;
      font-size: inherit;
      font-weight: inherit;
      color: ${props => props.theme.fontColor};
      cursor: pointer;
    }
  }

  .event-name {
    color: ${props => props.theme.graySteel};
    border-bottom: ${props => props.theme.graySteel} 1px solid;
    margin: 1.5rem 20%;
    text-align: center;
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
  
  .add-event-on-date {
    display: none;
  }
  `;
