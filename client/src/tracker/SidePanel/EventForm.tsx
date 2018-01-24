import * as React from 'react';
import EventModel, { EventType } from '../../event/EventModel';
import * as moment from 'moment';
import styled from 'styled-components';
import BackIcon from '../../icons/BackIcon';
import theme from '../../themes/default';
import * as classNames from 'classnames';

interface Props {
  airmanId: number;
  handleSubmit: (event: EventModel) => void;
  hideEventForm: () => void;
  event: EventModel | null;
  className?: string;
}

interface State {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  eventType: EventType;
}

export class EventForm extends React.Component<Props, State> {
  static readonly MONTH_FORMAT = 'YYYY-MM-DD';
  static readonly TIME_FORMAT = 'HH:mm';

  static hydrate(event: EventModel | null) {
    return {
      title: event ? event.title : '',
      description: event ? event.description : '',
      startDate: event ? event.startTime.format(EventForm.MONTH_FORMAT) : '',
      startTime: event ? event.startTime.format(EventForm.TIME_FORMAT) : '',
      endDate: event ? event.endTime.format(EventForm.MONTH_FORMAT) : '',
      endTime: event ? event.endTime.format(EventForm.TIME_FORMAT) : '',
      eventType: event ? event.type : EventType.Mission,
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = EventForm.hydrate(this.props.event);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState(EventForm.hydrate(nextProps.event));
  }

  /* tslint:disable:no-any*/
  handleChange = (event: any) => {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {airmanId, event} = this.props;
    const {title, description, startDate, startTime, endDate, endTime, eventType} = this.state;

    const startDateTime = moment.utc(`${startDate} ${startTime}`, 'YYYY-MM-DD HH:mm');
    const endDateTime = moment.utc(`${endDate} ${endTime}`, 'YYYY-MM-DD HH:mm');

    this.props.handleSubmit(new EventModel(
      title,
      description,
      startDateTime,
      endDateTime,
      airmanId,
      eventType,
      event ? event.id : null,
    ));
  }

  renderEventTypeRadios() {
    return Object.keys(EventType).map((type, key) => {
      const isChecked = this.state.eventType === EventType[type];
      return (
        <label key={key} className={classNames({checked: isChecked})}>
          <input
            type="radio"
            name="eventType"
            value={EventType[type]}
            onChange={this.handleChange}
            checked={isChecked}
          />
          {type}
        </label>
      );
    });
  }

  render() {
    return (
      <form className={this.props.className} onSubmit={this.handleSubmit}>
        <a className="back" onClick={this.props.hideEventForm}>
          <BackIcon color={theme.graySteel}/>
          <span>Back to Week View</span>
        </a>
        <div>Select Event Type:</div>
        {this.renderEventTypeRadios()}
        <input type="text" placeholder="Title" value={this.state.title} name="title" onChange={this.handleChange}/>
        <input
          type="text"
          placeholder="Description"
          value={this.state.description}
          name="description"
          onChange={this.handleChange}
        />
        <div className="date-time-row">
          <input type="date" value={this.state.startDate} name="startDate" onChange={this.handleChange}/>
          <input
            className="time-input"
            type="text"
            placeholder="hh:mm"
            value={this.state.startTime}
            name="startTime"
            onChange={this.handleChange}
          />
        </div>
        <div className="date-time-row">
          <input type="date" value={this.state.endDate} name="endDate" onChange={this.handleChange}/>
          <input
            className="time-input"
            type="text"
            placeholder="hh:mm"
            value={this.state.endTime}
            name="endTime"
            onChange={this.handleChange}
          />
        </div>
        <input type="submit" value="CONFIRM"/>
      </form>
    );
  }
}

export default styled(EventForm)`
  text-align: left;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.graySteel};
  
  input {
    margin: 1rem 1rem 0rem 1rem;
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }

  input[type="text"] {
    border-bottom: 1px solid ${props => props.theme.graySteel};
  }
  
  label {
    color: ${props => props.theme.fontColor};
  }
  
  label.checked {
    color: ${props => props.theme.yellow}
  }
  
  .time-input::placeholder {
    color: ${props => props.theme.fontColor};
  }
  
  .date-time-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    
    input[type="date"] {
      border-bottom: 1px solid ${props => props.theme.graySteel};
      
      &::-webkit-inner-spin-button {
        display: none;
      }
      
      
    }
  }
  
  input[type="submit"] {
    margin-top: 2rem;
    width: fit-content;
    margin-left: auto;
    background: none;
    color: inherit;
    border: 1px solid ${props => props.theme.fontColor};
    padding: 0.5rem 1rem;
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    outline: inherit;
  }
  
  input[type='radio'] {
    visibility: hidden;
  }
  
  input[type='radio']:before {
    content: ' ';
    visibility: visible;
    border: 1px solid ${props => props.theme.graySteel};
    width: 1rem;
    height: 1rem;
    display: inline-block;
    border-radius: 50%;
    transition: all .25s ease-in-out;
  }
  
  input[type='radio']:checked:before {
   background: ${props => props.theme.graySteel};
  }
  
  .back{
    cursor: pointer;
    fill: ${props => props.theme.graySteel};
    background: none;
    color: ${props => props.theme.graySteel};
    font-size: 0.875rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1.5rem 0;
    span {
      margin-left: 0.5rem;
    }
  }
`;