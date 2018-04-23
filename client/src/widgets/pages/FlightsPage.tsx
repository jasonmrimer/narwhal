import * as React from 'react';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { StyledTopBar } from '../TopBar';
import { StyledSiteManager } from '../../site-manager/SiteManager';
import { SiteManagerStore } from '../../site-manager/stores/SiteManagerStore';

interface Props {
  profileStore: ProfileSitePickerStore;
  siteManagerStore: SiteManagerStore;
}

export const FlightsPage = (props: Props) => {
  return (
    <React.Fragment>
      <StyledTopBar
        profile={props.profileStore.profile!}
      />
      <StyledSiteManager siteManagerStore={props.siteManagerStore}/>
    </React.Fragment>
  );
};