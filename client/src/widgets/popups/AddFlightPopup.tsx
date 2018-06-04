import * as React from 'react';
import styled from 'styled-components';
import { SiteManagerStore } from '../../site-manager/stores/SiteManagerStore';
import { StyledPopupModal } from './PopupModal';
import { inject } from 'mobx-react';
import { StyledTextInput } from '../inputs/TextInput';

interface Props {
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
    return (
      <div className={this.props.className}>
        <StyledPopupModal
          title="Add Flight"
          onConfirm={this.props.siteManagerStore!.savePendingNewFlight}
          onCancel={this.props.siteManagerStore!.cancelPendingNewFlight}
        >
          <StyledTextInput
            value={this.state.flightName}
            name="Name"
            onChange={this.onChange}
          />
        </StyledPopupModal>
      </div>
    );
  }
}

export const StyledAddFlightPopup = inject('siteManagerStore')(styled(AddFlightPopup)`

`);