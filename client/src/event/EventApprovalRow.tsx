import * as React from 'react';
import {observer} from "mobx-react";
import styled from "styled-components";
import {EventApproval, EventApprovalRole, EventModel, EventStatus} from "./models/EventModel";
import {StyledButton} from "../widgets/buttons/Button";
import { Moment } from 'moment';

interface Props {
  event: EventModel;
  onClickDeny: any;
  onClickApprove: any;
  role: EventApprovalRole;
  className?: string;
}

@observer
export class EventApprovalRow extends React.Component<Props> {
  render() {
    let approval: EventApproval | null;
    let username: string | null;
    let approvedTime: Moment | null;

    if (this.props.role === EventApprovalRole.Supervisor) {
      approval = this.props.event.supervisorApproval;
      username = this.props.event.supervisorUsername;
      approvedTime = this.props.event.supervisorApprovalTime;
    } else {
      approval = this.props.event.schedulerApproval;
      username = this.props.event.schedulerUsername;
      approvedTime = this.props.event.schedulerApprovalTime;
    }

    return (
      <div className={this.props.className}>
        {
          this.props.event.status === EventStatus.Pending && approval === null &&
          <div>
            <StyledButton text="DENY" onClick={this.props.onClickDeny}/>
            <StyledButton text="APPROVE" onClick={this.props.onClickApprove}/>
          </div>
        }

        {
          //TODO: Work here
        }
        
        {
          this.props.event.status === EventStatus.Pending && approval !== null &&
            <div>
              <span>{approval.toString()}</span>
              <span>{username}</span>
              <span>{approvedTime}</span>
            </div>
        }
      </div>
    )
  }
}

export const StyledEventApprovalRow = styled(EventApprovalRow)`

`;