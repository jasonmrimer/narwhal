import * as React from 'react';
import EventModel from '../../event/EventModel';
import * as moment from 'moment';
import styled from 'styled-components';
import BackIcon from '../../icons/BackIcon';

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
}

export class EventForm extends React.Component<Props, State> {
  readonly monthFormat = 'YYYY-MM-DD';
  readonly timeFormat = 'HH:mm';

  constructor(props: Props) {
    super(props);
    const {event} = this.props;
    this.state = {
      title: event ? event.title : '',
      description: event ? event.description : '',
      startDate: event ? event.startTime.format(this.monthFormat) : '',
      startTime: event ? event.startTime.format(this.timeFormat) : '',
      endDate: event ? event.endTime.format(this.monthFormat) : '',
      endTime: event ? event.endTime.format(this.timeFormat) : '',
    };
  }

  /* tslint:disable:no-any*/
  handleChange = (event: any) => {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {airmanId, event} = this.props;
    const {title, description, startDate, startTime, endDate, endTime} = this.state;

    const startDateTime = moment.utc(`${startDate} ${startTime}`, 'YYYY-MM-DD HH:mm');
    const endDateTime = moment.utc(`${endDate} ${endTime}`, 'YYYY-MM-DD HH:mm');

    this.props.handleSubmit(new EventModel(
      title,
      description,
      startDateTime,
      endDateTime,
      airmanId,
      event ? event.id : null,
    ));
  }

  render() {
    return (
      <form className={this.props.className} onSubmit={this.handleSubmit}>
        <a
          className="back"
          onClick={this.props.hideEventForm}
        >
          <BackIcon/>
          <span>
            Back to Week View
          </span>
        </a>
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
  display: flex;
  flex-direction: column;
  
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
    background: none !important;
    color: inherit;
    border: 1px solid ${props => props.theme.fontColor};
    padding: 0.5rem 1rem;
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    outline: inherit !important;
  }
  
  .back{
    cursor: pointer;
    padding-top: 1rem;
    fill: ${props => props.theme.graySteel};
    background: none;
    color: ${props => props.theme.graySteel};
    font-size: 0.875rem;
  }
`;