import * as React from 'react';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import styled from 'styled-components';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { observer } from 'mobx-react';
import { StyledProfileSitePicker } from '../profile/ProfileSitePicker';
import { Routes } from './Routes';
import { MissionPlannerStore } from '../crew/stores/MissionPlannerStore';

interface Props {
  dashboardStore: DashboardStore;
  trackerStore: TrackerStore;
  missionPlannerStore: MissionPlannerStore;
  profileStore: ProfileSitePickerStore;
}

@observer
export class App extends React.Component<Props> {
  async componentDidMount() {
    await this.props.profileStore.hydrate();
  }

  render() {
    return this.props.profileStore.profile ?
      (
        <div>
          <div id="classification-banner" style={{marginBottom: '7rem'}}>
            <StyledClassificationBanner classified={this.props.profileStore.profile!.classified}/>
            <StyledAuthorizationBanner/>
          </div>
          <div>
            {
              this.profileHasSite() ?
                <Routes {...this.props} /> :
                <StyledProfileSitePicker profileStore={this.props.profileStore}/>
            }
          </div>
        </div>
      ) : null;
  }

  private profileHasSite() {
    return this.props.profileStore.profile!.user.siteId != null;
  }
}

export const ClassificationBanner = (props: { classified: boolean, className?: string }) => {
  return (
    <div className={props.className} id="classification-banner">
      {props.classified ?
        'Dynamic Classification Highest Possible Classification: TS//SI//REL TO USA, FVEY' :
        'Not Actual Classification. Prototype Only'
      }
    </div>
  );
};

const StyledClassificationBanner = styled(ClassificationBanner)`
  background: red;
  text-align: center;
  position: fixed;
  width: 100%;
  height: 1.5rem;
  top: 0;
  z-index: 1000;
`;

const AuthorizationBanner = (props: { className?: string }) => {
  return (
    <div className={props.className}>
      Authorized Personnel Only
    </div>
  );
};

const StyledAuthorizationBanner = styled(AuthorizationBanner)`
  background: #5C6977;
  text-align: center;
  position: fixed;
  top: 1.5rem;
  height: 1.5rem;
  width: 100%;
  z-index: 1000;
`;
