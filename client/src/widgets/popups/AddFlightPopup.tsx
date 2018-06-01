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

export const AddFlightPopup = (props: Props) => {
  return (
    <StyledPopupModal
      title="Add Flight"
      onConfirm={props.siteManagerStore!.saveNewFlight}
      onCancel={props.siteManagerStore!.cancelAddFlight}
    >
      <StyledTextInput
        value=""
        name="Name"
        onChange={() => {}}
      />
    </StyledPopupModal>
  );
}

export const StyledAddFlightPopup = inject('siteManagerStore')(styled(AddFlightPopup)`

`);