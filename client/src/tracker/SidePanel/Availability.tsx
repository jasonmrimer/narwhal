import * as React from 'react';
import { Moment } from 'moment';
import styled from 'styled-components';
import EventModel from '../../event/EventModel';
import AirmanEvent from '../../airman/AirmanEvent';
import EventForm from './EventForm';
import { observer } from 'mobx-react';
import TrackerStore from '../stores/TrackerStore';
import NextIcon from '../../icons/NextIcon';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

interface State {
  showEventForm: boolean;
  selectedEvent: EventModel | null;
}

@observer
export class Availability extends React.Component<Props, State> {
  state: State = {showEventForm: false, selectedEvent: null};

  scheduledEventsForDate = (day: Moment, events: EventModel[]) => {
    const eventsForDay = events.filter((event) => day.isSame(event.startTime, 'day'));
    return eventsForDay.length === 0
      ? <div className="event-name">No Events Scheduled</div>
      : eventsForDay.map((event, index) => {
        return (
          <AirmanEvent
            key={index}
            event={event}
            deleteEvent={this.props.trackerStore.deleteEvent}
            editEvent={this.editEvent}
          />
        );
      });
  }

  editEvent = (event: EventModel) => {
    this.setState({showEventForm: !this.state.showEventForm, selectedEvent: event});
  }

  toggleEventForm = () => {
    this.setState({showEventForm: !this.state.showEventForm});
  }

  submitEvent = async (event: EventModel) => {
    await this.props.trackerStore.addEvent(event);
    this.setState({showEventForm: false});
  }

  renderEventForm = () => {
    return (
      <EventForm
        airmanId={this.props.trackerStore.selectedAirman.id}
        hideEventForm={this.toggleEventForm}
        handleSubmit={this.submitEvent}
        event={this.state.selectedEvent}
      />
    );
  }

  renderAvailability = () => {
    const {trackerStore} = this.props;
    const week = trackerStore.week;
    return (
      <div>
        <div className="event-control-row">
          <button className="add-event" onClick={this.toggleEventForm}>
            + Add Event
          </button>
        </div>
        <div className="nav-row">
          <h3>
            {week[0].format('DD MMM').toUpperCase()} - {week[6].format('DD MMM').toUpperCase()}
          </h3>
          <button className="next-week" onClick={trackerStore.incrementWeek}>
            <NextIcon/>
          </button>
        </div>
        <div className="availability">
          {
            trackerStore.week.map((day, index) => {
              return (
                <div id={`day-${index}`} key={index}>
                  <div className="event-date">{day.format('ddd, DD MMM YY').toUpperCase()}</div>
                  {this.scheduledEventsForDate(day.utc(), trackerStore.selectedAirman.events)}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.state.showEventForm ? this.renderEventForm() : this.renderAvailability()}
      </div>
    );
  }
}

export default styled(Availability)`
  width: 100%;
  text-align: center;

  h3 {
    font-size: 0.875rem;
    font-weight: 500;
    margin: 0;
  }

  .event-control-row {
    display: flex;
    justify-content: flex-end;

    .add-event {
      margin: 0.5rem 1rem;
      color: ${props => props.theme.fontColor};
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
  }
  `;
