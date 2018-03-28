import * as React from 'react';
import { StyledTopBar } from '../TopBar';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { StyledDashboard } from '../../dashboard/Dashboard';
import { DashboardStore } from '../../dashboard/stores/DashboardStore';
import { observer } from 'mobx-react';

interface Props {
  profileStore: ProfileSitePickerStore;
  dashboardStore: DashboardStore;
}

export const DashboardPage = observer((props: Props) => {
  return (
    <React.Fragment>
      <StyledTopBar
        username={props.profileStore.profile!.user.username}
      />
      <StyledDashboard
        username={props.profileStore.profile!.user.username}
        dashboardStore={props.dashboardStore}
      />
    </React.Fragment>
  );
});