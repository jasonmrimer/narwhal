import * as React from 'react';
import styled from 'styled-components';
import { SiteManagerStore } from '../../site-manager/stores/SiteManagerStore';
import { StyledPopupModal } from './PopupModal';
import { inject, observer } from 'mobx-react';
import { StyledTextInput } from '../inputs/TextInput';
import { SiteManagerActions } from '../../site-manager/actions/SiteManagerActions';

interface Props {
  siteManagerActions?: SiteManagerActions;
  siteManagerStore?: SiteManagerStore;
  className?: string;
}

@observer
export class AddFlightPopup extends React.Component<Props> {
  render() {
    const {siteManagerActions, siteManagerStore} = this.props;
    const {setPendingFlightName, pendingNewFlightName} = siteManagerStore!;

    return (
      <div className={this.props.className}>
        <StyledPopupModal
          title="ADD FLIGHT"
          onConfirm={() => siteManagerActions!.saveNewFlight()}
          onCancel={() => siteManagerActions!.cancelNewFlight()}
        >
          <div className="flight-name-input">
            <span>FLIGHT NAME</span>
            <StyledTextInput
              value={pendingNewFlightName}
              name="name"
              className="flight-popup"
              onChange={(e) => setPendingFlightName(e.target.value)}
            />
          </div>
        </StyledPopupModal>
      </div>
    );
  }
}

export const StyledAddFlightPopup = inject(
  'siteManagerStore',
  'siteManagerActions'
)(styled(AddFlightPopup)`
  .flight-name-input {
    padding: 1.5rem;
    display: flex;
    
    span {
      font-size: 0.875rem;
      margin-right: 1rem;
    }
    
    input {
      width: 76%;
    }
  }
`);