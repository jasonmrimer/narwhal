import * as React from 'react';
import { StyledTopBar } from '../TopBar';
import { observer } from 'mobx-react';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { StyledProfileList } from '../../admin/ProfileList';
import { AdminStore } from '../../admin/stores/AdminStore';

interface Props {
  profileStore: ProfileSitePickerStore;
  adminStore: AdminStore;
}

export const AdminPage = observer((props: Props) => {
  return (
    <React.Fragment>
      <StyledTopBar
        profile={props.profileStore.profile!}
      />
      <StyledProfileList store={props.adminStore}/>
    </React.Fragment>
  );
});