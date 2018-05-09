import * as React from 'react';
import { StyledTopBar } from '../../widgets/TopBar';
import { StyledSiteManager } from '../../site-manager/SiteManager';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { inject, observer } from 'mobx-react';
import { Can } from '@casl/react';


interface Props {
  profileStore?: ProfileSitePickerStore;
}

export const FlightsPage = inject('profileStore')(observer((props: Props) => {
  const {profileStore} = props;
  return <React.Fragment>
    <StyledTopBar/>
    <Can do="read" on="mission" ability={profileStore!.profile!.ability!}>
      <StyledSiteManager/>
    </Can>
    <Can do="error" on="all" ability={profileStore!.profile!.ability!}>
      <h1 style={{textAlign: 'center'}}>You do not have access to this page.</h1>
    </Can>
  </React.Fragment>;
}));