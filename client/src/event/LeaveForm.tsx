import * as React from 'react';
import styled from 'styled-components';
import { LeaveFormStore } from './stores/LeaveFormStore';
import { inject, observer } from 'mobx-react';
import { StyledTextInput } from '../widgets/inputs/TextInput';
import { StyledDatePicker } from '../widgets/inputs/DatePicker';
import { StyledTimeInput } from '../widgets/inputs/TimeInput';
import { StyledSubmitButton } from '../widgets/forms/SubmitButton';
import { StyledFieldValidation } from '../widgets/inputs/FieldValidation';
import { StyledForm, StyledFormRow } from '../widgets/forms/Form';
import { EventApproval, EventApprovalRole, EventModel } from './models/EventModel';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { EventActions } from './EventActions';
import { StyledEventCreationInfo } from '../widgets/EventCreationInfo';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { StyledButton } from '../widgets/buttons/Button';
import { DeleteIcon } from '../icons/DeleteIcon';
import { StyledEventApprovalRow } from './EventApprovalRow';

interface Props {
  leaveFormStore?: LeaveFormStore;
  trackerStore?: TrackerStore;
  profileStore?: ProfileSitePickerStore;
  airmanId: number;
  event: EventModel | null;
  eventActions?: EventActions;
  className?: string;
}

@observer
export class LeaveForm extends React.Component<Props> {
  componentDidMount() {
    this.props.leaveFormStore!.open(this.props.event);
  }

  handleChange = ({target}: any) => {
    this.props.leaveFormStore!.setState(target.name, target.value);
  };

  handleDelete = async () => {
    await this.props.eventActions!.handleDeleteEvent(this.props.leaveFormStore!.model!);
  };

  handleSubmit = async (e: any) => {
    e.preventDefault();
    await this.props.eventActions!.handleFormSubmit(this.props.airmanId, this.props.leaveFormStore!);
  };

  handleApprovalDecision = async (approvalChoice: EventApproval, approvalRole: EventApprovalRole) => {
    await this.props.eventActions!.updateEventApproval(approvalChoice, approvalRole);
  };

  render() {
    const {state, errors, hasModel} = this.props.leaveFormStore!;
    return (
      <StyledForm onSubmit={this.handleSubmit} performLoading={this.props.trackerStore!.performLoading}>
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

        {
          this.props.event ?
            <StyledEventApprovalRow
              event={this.props.event}
              role={EventApprovalRole.Supervisor}
              onClickApprove={
                async () => await this.handleApprovalDecision(EventApproval.Approved, EventApprovalRole.Supervisor)
              }
              onClickDeny={
                async () => await this.handleApprovalDecision(EventApproval.Denied, EventApprovalRole.Supervisor)
              }
            /> :
            null
        }

        {
          this.props.event ?
            <StyledEventApprovalRow
              event={this.props.event}
              role={EventApprovalRole.Scheduler}
              onClickApprove={
                async () => await this.handleApprovalDecision(EventApproval.Approved, EventApprovalRole.Scheduler)
              }
              onClickDeny={
                async () => await this.handleApprovalDecision(EventApproval.Denied, EventApprovalRole.Scheduler)
              }
            /> :
            null
        }

        <StyledFormRow reversed={true}>
          {
            this.props.profileStore!.profile!.roleName === 'READER' ?
              <StyledSubmitButton text="SUBMIT REQUEST"/> :
              <StyledSubmitButton text="CONFIRM"/>
          }
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

export const StyledLeaveForm = inject(
  'leaveFormStore',
  'trackerStore',
  'eventActions',
  'profileStore'
)(styled(LeaveForm)`
  min-width: ${props => props.theme.sidePanelWidth};
`);