import * as React from 'react';
import { StyledButton } from './buttons/Button';
import { StyledDatePicker } from './inputs/DatePicker';
import { SiteManagerActions } from '../site-manager/actions/SiteManagerActions';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { SiteManagerStore } from '../site-manager/stores/SiteManagerStore';

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
      <div className={this.props.className}>
        <div className="confirmation">
          <div className="title">Schedule Settings</div>

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
          <div className="actions">
            <StyledButton
              className="cancel"
              onClick={this.props.onCancel}
              text="CANCEL"
            />
            <StyledButton
              className="confirm"
              onClick={async () => await this.props.siteManagerActions!.saveFlightSchedule()}
              text="CONFIRM"
            />
          </div>
        </div>
      </div>
    );
  }
}

export const StyledFlightSchedulePopup = inject(
  'siteManagerActions',
  'siteManagerStore')(styled(FlightSchedulePopup)`
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-size: 1rem;
  z-index: 1001;
  text-align: left;
  
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
  
  .confirmation {
    background: ${props => props.theme.blueSteel};
    width: 500px;
    display: flex;
    flex-direction: column;
    position: relative; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%);
    padding: 2px;
    
    .title {
      background: ${props => props.theme.dark};
      padding: 0.45rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-top-left-radius: 2%;      
      border-top-right-radius: 2%;      
    }
    
    & > span {
      padding: 1rem;
    }
    
    .actions {
      padding: 1rem;
      display: flex;    
      justify-content: flex-end;
      
      button {
        font-size: 0.75rem;
        padding: 0.5rem 1.5rem;
        margin-left: 0.5rem;
        font-weight: 500;
        background: none;
        color: ${props => props.theme.fontColor};
        border: 1px solid ${props => props.theme.fontColor}; 
        border-radius: 5%;
        cursor: pointer;
      
        &.cancel {
          background: ${props => props.theme.yellow};
          color: ${props => props.theme.darkest};
          border: none;
        }
      
        &:hover {
          background: ${props => props.theme.fontColor};
          color: ${props => props.theme.darkest};
          text-decoration: underline;
        
          &.cancel{
           background: ${props => props.theme.yellowHover};
            color: ${props => props.theme.darkest};
          }
        }
      }
    }
  }
`);