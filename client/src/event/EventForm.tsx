import * as React from 'react';
import EventModel, { EventType } from './models/EventModel';
import styled from 'styled-components';
import BackIcon from '../icons/BackArrow';
import theme from '../themes/default';
import DatePicker from '../widgets/DatePicker';
import FieldValidation from '../widgets/FieldValidation';
import TextInput from '../widgets/TextInput';
import TimeInput from '../widgets/TimeInput';
import SubmitButton from '../widgets/SubmitButton';
import RadioButtons from '../widgets/RadioButtons';
import { MissionModel } from '../mission/models/MissionModel';
import TypeAheadInput from '../widgets/TypeAheadInput';
import FilterOption from '../widgets/models/FilterOptionModel';

interface Props {
  airmanId: number;
  hideEventForm: () => void;
  handleSubmit: (event: EventModel) => void;
  event: EventModel | null;
  missions: MissionModel[];
  missionOptions: FilterOption[];
  className?: string;
}

export interface EventFormState {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  eventType: string;
}

export function emptyEventFormState() {
  return {
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    eventType: ''
  };
}

export class EventForm extends React.Component<Props, EventFormState> {
  static readonly MONTH_FORMAT = 'YYYY-MM-DD';
  static readonly TIME_FORMAT = 'HH:mm';

  static hydrate(event: EventModel | null) {
    return event ? event.toEventFormState() : emptyEventFormState();
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
    const updateEvent = EventModel.fromEventFormState(airmanId, this.state, event ? event.id : null);
    this.props.handleSubmit(updateEvent);
  }

  handleMissionSelect = (item: FilterOption[]) => {
    if (item.length > 0) {
      const selectedMission = this.props.missions.find(mission => mission.missionId === item[0].value)!;
      const endDateAndTime = selectedMission.endDateTime;

      const attrs = {
        title: selectedMission.atoMissionNumber,
        startDate: selectedMission.startDateTime.format(EventForm.MONTH_FORMAT),
        startTime: selectedMission.startDateTime.format(EventForm.TIME_FORMAT),
        endDate: endDateAndTime ? endDateAndTime.format(EventForm.MONTH_FORMAT) : '',
        endTime: endDateAndTime ? endDateAndTime.format(EventForm.TIME_FORMAT) : '',
        eventType: EventType.Mission
      };
      const eventFormState = Object.assign(emptyEventFormState(), attrs);
      this.setState(eventFormState);
    } else {
      this.setState(emptyEventFormState());
    }
  }

  render() {
    return (
      <form className={this.props.className} onSubmit={this.handleSubmit}>

        <a className="back" onClick={this.props.hideEventForm}>
          <BackIcon color={theme.graySteel}/>
          <span>Back to Week View</span>
        </a>
        <div>Select Event Type:</div>
        <div className="form-wrapper">

        <RadioButtons
          name="eventType"
          options={Object.keys(EventType).map(key => EventType[key])}
          value={this.state.eventType}
          onChange={this.handleChange}
        />
        {
          this.state.eventType === EventType.Mission &&
          <TypeAheadInput
              multiple={false}
              options={this.props.missionOptions}
              onChange={this.handleMissionSelect}
              placeholder="Mission ID"
          />
        }
        <FieldValidation name="title" errors={this.props.event ? this.props.event.errors : null}>
          <div className="input-row">
            <TextInput
              placeholder="Title"
              value={this.state.title}
              name="title"
              onChange={this.handleChange}
            />
          </div>
        </FieldValidation>
        <div className="input-row">
          <TextInput
            placeholder="Description"
            value={this.state.description}
            name="description"
            onChange={this.handleChange}
          />
        </div>
        <FieldValidation name="startTime" errors={this.props.event ? this.props.event.errors : null}>
          <div className="input-row">
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
          <div className="input-row">
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
        <div className="form-row">
          <SubmitButton text="CONFIRM"/>
        </div>
        <div style={{minHeight: 150}}/>
        </div>
      </form>
    );
  }
}

export default styled(EventForm)`
  text-align: left;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.graySteel};
 
 .form-wrapper {
    margin: 0 1rem;
 }
  .date-time-input-row {
  .input-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 1rem 0rem;
    margin: 1rem 1rem 0rem 1rem; 
  }
  
  .form-row {
      display: flex;
      flex-direction: row-reverse;
      margin-top: 2rem;
      align-items: baseline;
  };
  
  .styled-select {
    margin: 1rem 1rem 0;
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