import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { StyledTextInput } from '../widgets/inputs/TextInput';
import { StyledDatePicker } from '../widgets/inputs/DatePicker';
import { StyledTimeInput } from '../widgets/inputs/TimeInput';
import { StyledSubmitButton } from '../widgets/forms/SubmitButton';
import { StyledFieldValidation } from '../widgets/inputs/FieldValidation';
import { StyledButton } from '../widgets/buttons/Button';
import { StyledForm, StyledFormRow } from '../widgets/forms/Form';
import { DeleteIcon } from '../icons/DeleteIcon';
import { AppointmentFormStore } from './stores/AppointmentFormStore';
import { EventModel } from './models/EventModel';
import { EventActions } from './EventActions';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { StyledEventCreationInfo } from '../widgets/EventCreationInfo';

interface Props {
  appointmentFormStore?: AppointmentFormStore;
  trackerStore?: TrackerStore;
  eventActions?: EventActions;
  airmanId: number;
  event: EventModel | null;
  className?: string;
}

@observer
export class AppointmentForm extends React.Component<Props> {
  componentDidMount() {
    this.props.appointmentFormStore!.open(this.props.event);
  }

  handleChange = ({target}: any) => {
    this.props.appointmentFormStore!.setState(target.name, target.value);
  }

  handleDelete = async () => {
    await this.props.eventActions!.handleDeleteEvent(this.props.appointmentFormStore!.model!);
  }

  handleSubmit = async (e: any) => {
    e.preventDefault();
    await this.props.eventActions!.handleFormSubmit(this.props.airmanId, this.props.appointmentFormStore!);
  }

  render() {
    const {trackerStore, appointmentFormStore} = this.props;
    const {state, errors, hasModel} = appointmentFormStore!;
    return (
      <StyledForm onSubmit={this.handleSubmit} performLoading={trackerStore!.performLoading}>
        <StyledFieldValidation fieldName="title" errors={errors}>
          <StyledFormRow>
            <StyledTextInput
              name="title"
              onChange={this.handleChange}
              placeholder="Title"
              value={state.title}
            />
          </StyledFormRow>
        </StyledFieldValidation>

        <StyledFormRow>
          <StyledTextInput
            name="description"
            onChange={this.handleChange}
            placeholder="Description"
            value={state.description}
          />
        </StyledFormRow>

        <StyledFieldValidation fieldName="validDateRange" errors={errors}>
          <StyledFieldValidation fieldName="startTime" errors={errors}>
            <StyledFormRow>
              <StyledDatePicker
                name="startDate"
                onChange={this.handleChange}
                value={state.startDate}
              />
              <StyledTimeInput
                name="startTime"
                onChange={this.handleChange}
                value={state.startTime}
              />
            </StyledFormRow>
          </StyledFieldValidation>

          <StyledFieldValidation fieldName="endTime" errors={errors}>
            <StyledFormRow>
              <StyledDatePicker
                name="endDate"
                onChange={this.handleChange}
                value={state.endDate}
              />
              <StyledTimeInput
                name="endTime"
                onChange={this.handleChange}
                value={state.endTime}
              />
            </StyledFormRow>
          </StyledFieldValidation>
        </StyledFieldValidation>

        {
          this.props.event ?
            this.props.event!.createdBy &&
              <StyledEventCreationInfo event={this.props.event!}/> :
            null
        }

        <StyledFormRow reversed={true}>
          <StyledSubmitButton text="CONFIRM"/>
          {
            hasModel &&
            <StyledButton
              text="DELETE"
              onClick={this.handleDelete}
              renderIcon={() => <DeleteIcon/>}
            />
          }
        </StyledFormRow>
      </StyledForm>
    );
  }
}

export const StyledAppointmentForm = inject(
  'appointmentFormStore',
  'trackerStore',
  'eventActions'
)(styled(AppointmentForm)`
  min-width: ${props => props.theme.sidePanelWidth};
`);