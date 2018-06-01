import * as React from 'react';
import { StyledDatePicker } from '../inputs/DatePicker';
import { SiteManagerActions } from '../../site-manager/actions/SiteManagerActions';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { SiteManagerStore } from '../../site-manager/stores/SiteManagerStore';
import { StyledPopupModal } from './PopupModal';

interface Props {
  onCancel: () => void;
  siteManagerActions?: SiteManagerActions;
  siteManagerStore?: SiteManagerStore;
  className?: string;
}

@observer
export class FlightSchedulePopup extends React.Component<Props> {
  render() {
    return (
      <StyledPopupModal
        title="Schedule Settings"
        className={this.props.className}
        onCancel={this.props.onCancel}
        onConfirm={async () => await this.props.siteManagerActions!.saveFlightSchedule()}
      >
        <div className="startDate">
          <div>Schedule Start Date:</div>
          <StyledDatePicker
            name="startDate"
            onChange={(e) => {
              this.props.siteManagerActions!.setPendingScheduleStartDate(e.target.value);
            }}
            value={this.props.siteManagerStore!.pendingScheduleStartDate}
          />
        </div>
      </StyledPopupModal>
    );
  }
}

export const StyledFlightSchedulePopup = inject(
  'siteManagerActions',
  'siteManagerStore')(styled(FlightSchedulePopup)`
  .startDate {
    display: flex;
    justify-content: center;
    padding: 0.5rem 0;
    
    > div {
      margin: 0.5rem;
    }
    
    div {
      background: ${props => props.theme.blueSteel};
    }
    
    input {
      background: ${props => props.theme.blueSteel};
    }
    
    .DayPicker, .DayPicker div {
      background: ${props => props.theme.dark}
    }
  }
`);