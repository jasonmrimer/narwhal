import * as React from 'react';
import styled from 'styled-components';
import { LeaveFormStore } from './stores/LeaveFormStore';
import { observer } from 'mobx-react';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledTimeInput } from '../widgets/TimeInput';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledDeleteButton } from '../widgets/DeleteButton';

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
      <form className={this.props.className} onSubmit={this.handleSubmit}>
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

export const StyledLeaveForm = styled(LeaveForm)`
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