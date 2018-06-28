import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { EventApproval, EventModel, EventStatus } from './models/EventModel';
import { StyledButton } from '../widgets/buttons/Button';
import { Moment } from 'moment';

interface Props {
  event: EventModel;
  onClickDeny: any;
  onClickApprove: any;
  eventApproval: EventApproval | null;
  username: string;
  approvalTime: Moment | null;
  className?: string;
}

@observer
export class EventApprovalRow extends React.Component<Props> {
  render() {
    const {eventApproval, username, approvalTime} = this.props;

    return (
      <div className={this.props.className}>
        {
          this.props.event.status === EventStatus.Pending && eventApproval === null &&
          <div>
            <StyledButton text="DENY" onClick={this.props.onClickDeny}/>
            <StyledButton text="APPROVE" onClick={this.props.onClickApprove}/>
          </div>
        }

        {
          //TODO: Work here
        }

        {
          this.props.event.status === EventStatus.Pending && eventApproval !== null &&
          <div>
            <span className="approval-decision">{eventApproval.toString()}</span>
            <span>{username}</span>
            <span>{approvalTime!.format("DD MMM YY / HHmm").toUpperCase()}</span>
          </div>
        }
      </div>
    )
  }
}

export const StyledEventApprovalRow = styled(EventApprovalRow)`
  .approval-decision {
    text-transform: lowercase;
  }
  
  .approval-decision::first-letter {
    text-transform: uppercase;
  }
`;