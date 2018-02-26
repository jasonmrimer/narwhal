import * as React from 'react';
import styled from 'styled-components';
import { AppointmentFormStore } from './stores/AppointmentFormStore';
import { observer } from 'mobx-react';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledTimeInput } from '../widgets/TimeInput';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledDeleteButton } from '../widgets/DeleteButton';

interface Props {
  airmanId: number;
  appointmentFormStore: AppointmentFormStore;
  className?: string;
}

@observer
export class AppointmentForm extends React.Component<Props> {
  /* tslint:disable:no-any*/
  handleChange = ({target}: any) => {
    this.props.appointmentFormStore.setState({[target.name]: target.value});
  }

  handleDelete = () => {
    this.props.appointmentFormStore.removeAppointment();
  }

  /* tslint:disable:no-any*/
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.appointmentFormStore.addAppointment(this.props.airmanId);
  }

  render() {
    const {state, errors, hasEvent} = this.props.appointmentFormStore;
    return (
      <form className={this.props.className} onSubmit={this.handleSubmit}>
        <div className="input-row">
          <StyledFieldValidation name="title" errors={errors}>
            <StyledTextInput
              name="title"
              onChange={this.handleChange}
              placeholder="Title"
              value={state.title}
            />
          </StyledFieldValidation>
        </div>

        <div className="input-row">
          <StyledTextInput
            name="description"
            onChange={this.handleChange}
            placeholder="Description"
            value={state.description}
          />
        </div>

        <StyledFieldValidation name="startTime" errors={errors}>
          <div className="input-row">
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
          </div>
        </StyledFieldValidation>

        <StyledFieldValidation name="endTime" errors={errors}>
          <div className="input-row">
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
          </div>
        </StyledFieldValidation>

        <div className="form-row">
          {hasEvent && <StyledDeleteButton handleClick={this.handleDelete}/>}
          <StyledSubmitButton text="CONFIRM"/>
        </div>
      </form>
    );
  }
}

export const StyledAppointmentForm = styled(AppointmentForm)`
  text-align: left;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.graySteel};

   .form-wrapper {
      margin: 0 1rem;
   }

  .input-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .form-row {
    display: flex;
    margin-top: 2rem;
    align-items: baseline;
    justify-content: space-between;
  }

  .styled-select {
    margin: 1rem 1rem 0;
  }
`;