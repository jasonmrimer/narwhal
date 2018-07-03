import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { EventApproval, EventApprovalRole, EventModel, EventStatus } from './models/EventModel';
import { StyledButton } from '../widgets/buttons/Button';
import { Moment } from 'moment';
import { ApprovedIcon } from '../icons/ApprovedIcon';
import { DeniedIcon } from '../icons/DeniedIcon';

interface Props {
  event: EventModel;
  role: EventApprovalRole;
  onClickDeny: any;
  onClickApprove: any;
  className?: string;
}

@observer
export class EventApprovalRow extends React.Component<Props> {
  render() {
    let eventApproval: EventApproval | null;
    let username: string;
    let approvalTime: Moment;

    if ( this.props.role  === EventApprovalRole.Supervisor && this.props.event.supervisorApproval !== null) {
     eventApproval = this.props.event.supervisorApproval;
     username = this.props.event.supervisorUsername!;
     approvalTime = this.props.event.supervisorApprovalTime!;
    } else if (this.props.event.schedulerApproval !== null) {
      eventApproval = this.props.event.schedulerApproval;
      username = this.props.event.schedulerUsername!;
      approvalTime = this.props.event.schedulerApprovalTime!;
    } else {
      eventApproval = null;
    }

    return (
      <div className={this.props.className}>
        <div className="approval-role">{this.props.role.toString().toLowerCase()} approval</div>
        {
          this.props.event.status !== EventStatus.AutoAuthorized && eventApproval === null &&
          <div className="event-approval-buttons">
            <StyledButton className="deny-button" text="DENY" onClick={this.props.onClickDeny}/>
            <StyledButton className="approve-button" text="APPROVE" onClick={this.props.onClickApprove}/>
          </div>
        }

        {
          this.props.event.status !== EventStatus.AutoAuthorized && eventApproval !== null &&
          <div className="event-approval-decisions">
            <span className="approval-decision-row">
              {
                eventApproval === EventApproval.Approved &&
                  <ApprovedIcon/>
              }

              {
                eventApproval === EventApproval.Denied &&
                  <DeniedIcon/>
              }
              <span className="approval-decision">{eventApproval.toString().toLowerCase()}</span>
            </span>
            <div className="event-approver">{username!}</div>
            <div>{approvalTime!.format('DD MMM YY / HHmm').toUpperCase()}</div>
          </div>
        }
      </div>
    );
  }
}

export const StyledEventApprovalRow = styled(EventApprovalRow)`
  border-top: 1px solid ${props => props.theme.graySteel};
  padding: 0.5rem 0;
  margin: 0.5rem 0;
  
  .approval-role {
    text-transform: capitalize;
    font-weight: 500;
  }

  .approval-decision-row {
    vertical-align: middle;
    
    .approval-decision {
      text-transform: capitalize;
      font-size: 0.875rem;
      margin-left: 0.5rem;
    }
  }
  .event-approval-buttons {
    display: flex;
    margin-top: 0.5rem;
    
    button:first-child {
      margin-right: 0.5rem;
    }
    
    button:last-child {
      background: ${props => props.theme.yellow};
    }
  }
  
  .event-approval-decisions {
    margin-top: 0.5rem;
    
    div {
      font-size: 0.75rem;
      margin: 0.25rem 0  0 1.25rem;
    }
    
    .event-approver {
      color: ${props => props.theme.fontColor};
    }
  }
`;