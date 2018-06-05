import * as React from 'react';
import styled from 'styled-components';
import { SiteManagerStore } from '../../site-manager/stores/SiteManagerStore';
import { StyledPopupModal } from './PopupModal';
import { inject } from 'mobx-react';
import { StyledTextInput } from '../inputs/TextInput';
import { SiteManagerActions } from '../../site-manager/actions/SiteManagerActions';

interface Props {
  siteManagerActions?: SiteManagerActions;
  siteManagerStore?: SiteManagerStore;
  className?: string;
}

interface State {
  flightName: string;
}

export class AddFlightPopup extends React.Component<Props, State> {
  state = {flightName: ''};

  onChange = (e: any) => {
    this.setState({flightName: e.target.value});
    this.props.siteManagerStore!.setPendingFlightName(e.target.value);
  }

  render() {
    const {siteManagerActions} = this.props;
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
              value={this.state.flightName}
              name="name-input"
              className="flight-popup"
              onChange={this.onChange}
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