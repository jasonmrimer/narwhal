import * as React from 'react';
import { Moment } from 'moment';
import styled from 'styled-components';
import EventModel from '../../event/EventModel';
import AirmanEvent from '../../airman/AirmanEvent';
import EventForm from './EventForm';
import AirmanModel from '../../airman/models/AirmanModel';

interface Props {
  week: Moment[];
  airman: AirmanModel;
  submitEvent: (event: EventModel) => void;
  className?: string;
}

interface State {
  showEventForm: boolean;
}

export class Availability extends React.Component<Props, State> {
  state: State = {showEventForm: false};

  scheduledEventsForDate = (day: Moment, events: EventModel[]) => {
    const eventsForDay = events.filter((event) => day.isSame(event.startTime, 'day'));
    return eventsForDay.length === 0
      ? <div className="event-name">No Events Scheduled</div>
      : eventsForDay.map((event, index) => <AirmanEvent key={index} event={event}/>);
  }

  setShowEventForm = () => {
    this.setState({showEventForm: true});
  }

  submitEvent = (event: EventModel) => {
    const {submitEvent} = this.props;
    submitEvent(event);
    this.setState({showEventForm: false});
  }

  renderEventForm = () => {
    return <EventForm airmanId={this.props.airman.id} handleSubmit={this.submitEvent}/>;
  }

  renderAvailability = () => {
    const {week, airman} = this.props;

    return (
      <div>
        <div id="event-control-row">
          <button id="add-event" onClick={this.setShowEventForm}>
            + Add Event
          </button>
        </div>
        <h3> {week[0].format('DD MMM').toUpperCase()} - {week[6].format('DD MMM').toUpperCase()}</h3>
        <div className="availability">
          {
            week.map((day, index) => {
              return (
                <div key={`day-${index}`}>
                  <div className="event-date">{day.format('ddd, DD MMM YY').toUpperCase()}</div>
                  {this.scheduledEventsForDate(day.utc(), airman.events)}
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
  }
  
  #event-control-row {
    display: flex;
    justify-content: flex-end;
  
    #add-event {
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
  `;
