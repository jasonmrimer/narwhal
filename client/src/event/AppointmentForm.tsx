import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledTimeInput } from '../widgets/TimeInput';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledButton } from '../widgets/Button';
import { StyledForm, StyledFormRow } from '../widgets/Form';
import { DeleteIcon } from '../icons/DeleteIcon';
import { AppointmentFormStore } from './stores/AppointmentFormStore';
import { EventModel } from './models/EventModel';
import { EventActions } from './EventActions';
import { TrackerStore } from '../tracker/stores/TrackerStore';

interface Props {
  appointmentFormStore?: AppointmentFormStore;
  trackerStore?: TrackerStore;
  airmanId: number;
  event?: EventModel;
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
    await EventActions.handleDeleteEvent(this.props.appointmentFormStore!.model!);
  }

  handleSubmit = async (e: any) => {
    e.preventDefault();
    await EventActions.handleFormSubmit(this.props.airmanId, this.props.appointmentFormStore!);
  }

  render() {
    const {trackerStore, appointmentFormStore} = this.props;
    const {state, errors, hasModel} = appointmentFormStore!;
    return (
      <StyledForm onSubmit={this.handleSubmit} setLoading={trackerStore!.setLoading}>
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

export const StyledAppointmentForm = inject('appointmentFormStore', 'trackerStore')(styled(AppointmentForm)`
  min-width: ${props => props.theme.sidePanelWidth};
`);