import * as React from 'react';
import EventModel, { EventType } from '../../event/EventModel';
import * as moment from 'moment';
import styled from 'styled-components';
import BackIcon from '../../icons/BackArrow';
import theme from '../../themes/default';
import DatePicker from '../../widgets/DatePicker';
import FieldValidation from '../../widgets/FieldValidation';
import TextInput from '../../widgets/TextInput';
import RadioButtons from '../../widgets/RadioButtons';
import TimeInput from '../../widgets/TimeInput';
import SubmitButton from '../../widgets/SubmitButton';

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

  render() {
    return (
      <form className={this.props.className} onSubmit={this.handleSubmit}>

        <a className="back" onClick={this.props.hideEventForm}>
          <BackIcon color={theme.graySteel}/>
          <span>Back to Week View</span>
        </a>

        <div>Select Event Type:</div>
        <RadioButtons
          options={Object.keys(EventType).map(key => EventType[key])}
          value={this.state.eventType}
          onChange={this.handleChange}
        />

        <FieldValidation name="title" errors={this.props.event ? this.props.event.errors : null}>
          <TextInput
            placeholder="Title"
            value={this.state.title}
            name="title"
            onChange={this.handleChange}
          />
        </FieldValidation>

        <div>
          <TextInput
            placeholder="Description"
            value={this.state.description}
            name="description"
            onChange={this.handleChange}
          />
        </div>

        <FieldValidation name="startTime" errors={this.props.event ? this.props.event.errors : null}>
          <div className="date-time-input-row">
            <DatePicker
              dateValue={this.state.startDate}
              onChange={this.handleChange}
              name="start"
            />
            <TimeInput
              timeValue={this.state.startTime}
              onChange={this.handleChange}
              name="start"
            />
          </div>
        </FieldValidation>

        <FieldValidation name="endTime" errors={this.props.event ? this.props.event.errors : null}>
          <div className="date-time-input-row">
            <DatePicker
              dateValue={this.state.endDate}
              onChange={this.handleChange}
              name="end"
            />
            <TimeInput
              timeValue={this.state.endTime}
              onChange={this.handleChange}
              name="end"
            />
          </div>
        </FieldValidation>
        <SubmitButton text="CONFIRM"/>
      </form>
    );
  }
}

export default styled(EventForm)`
  text-align: left;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.graySteel};
 
  .date-time-input-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 1rem 1rem 0rem 1rem;
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