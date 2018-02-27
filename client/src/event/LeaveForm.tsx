import * as React from 'react';
import styled from 'styled-components';
import { LeaveFormStore } from './stores/LeaveFormStore';
import { observer } from 'mobx-react';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledTimeInput } from '../widgets/TimeInput';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledButton } from '../widgets/Button';
import { StyledForm, StyledFormRow } from '../widgets/Form';
import { DeleteIcon } from '../icons/DeleteIcon';

interface Props {
  airmanId: number;
  leaveFormStore: LeaveFormStore;
  className?: string;
}

@observer
export class LeaveForm extends React.Component<Props> {
  /* tslint:disable:no-any*/
  handleChange = ({target}: any) => {
    this.props.leaveFormStore.setState({[target.name]: target.value});
  }

  handleDelete = () => {
    this.props.leaveFormStore.removeLeave();
  }

  /* tslint:disable:no-any*/
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.leaveFormStore.addLeave(this.props.airmanId);
  }

  render() {
    const {state, errors, hasEvent} = this.props.leaveFormStore;
    return (
      <StyledForm onSubmit={this.handleSubmit}>
        <StyledFormRow>
          <StyledTextInput
            name="description"
            onChange={this.handleChange}
            placeholder="Description"
            value={state.description}
          />
        </StyledFormRow>

        <StyledFieldValidation name="startTime" errors={errors}>
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

        <StyledFieldValidation name="endTime" errors={errors}>
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

        <StyledFormRow reversed={true}>
          <StyledSubmitButton text="CONFIRM"/>
          {
            hasEvent &&
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

export const StyledLeaveForm = styled(LeaveForm)`
  min-width: ${props => props.theme.sidePanelWidth};
`;