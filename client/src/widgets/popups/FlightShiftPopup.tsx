import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { SiteManagerStore } from '../../site-manager/stores/SiteManagerStore';
import { StyledPopupModal } from './PopupModal';
import { ShiftDisplay } from '../../roster/ShiftDisplay';
import { SiteManagerActions } from '../../site-manager/actions/SiteManagerActions';

interface Props {
  onCancel: () => void;
  siteManagerActions?: SiteManagerActions;
  siteManagerStore?: SiteManagerStore;
  className?: string;
}

@observer
export class FlightShiftPopup extends React.Component<Props> {
  render() {
    const {siteManagerStore} = this.props;
    const {getAirmenByFlightId, pendingFlightId} = siteManagerStore!;

    return (
      <StyledPopupModal
        title="Shift Settings"
        className={this.props.className}
        onCancel={this.props.onCancel}
        onConfirm={async () => await this.props.siteManagerActions!.saveFlightShift()}
      >
        <div className="message">
          {siteManagerStore!.shiftPopupMessage}
        </div>

        <div className="icon">
          <ShiftDisplay
            shift={this.props.siteManagerStore!.pendingShift!}
          />
        </div>

        <div className="flight-count">
          This change will affect {getAirmenByFlightId(pendingFlightId!).length} operators.
        </div>
      </StyledPopupModal>
    );
  }
}

export const StyledFlightShiftPopup = inject(
  'siteManagerStore',
  'siteManagerActions'
  )(styled(FlightShiftPopup)`
    padding: 0.5rem 0;
    
    .message {
    margin: 0 0.5rem;
    }
    
    .icon {
    margin: auto;
    }
    
    .DayPicker, .DayPicker div {
      background: ${props => props.theme.dark}
    }    

  .flight-count {
    margin: auto;
    font-weight: 500;
    padding-bottom: 0.5rem;
  }
`);