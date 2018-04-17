import * as React from 'react';
import { StyledTopBar } from '../TopBar';
import { StyledTracker } from '../../tracker/Tracker';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { TrackerStore } from '../../tracker/stores/TrackerStore';
import { observer } from 'mobx-react';

interface Props {
  profileStore: ProfileSitePickerStore;
  trackerStore: TrackerStore;
}

export const TrackerPage = observer((props: Props) => {
  return (
    <React.Fragment>
      <StyledTopBar
        profile={props.profileStore.profile!}
      />
      <StyledTracker
        profile={props.profileStore.profile!}
        trackerStore={props.trackerStore}
      />
    </React.Fragment>
  );
});