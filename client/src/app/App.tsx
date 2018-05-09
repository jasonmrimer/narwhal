import * as React from 'react';
import styled from 'styled-components';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { inject, observer } from 'mobx-react';
import { StyledProfileSitePicker } from '../profile/ProfileSitePicker';
import { Routes } from './Routes';
import { withRouter } from 'react-router';
import { AppActions } from './AppActions';

interface Props {
  profileStore?: ProfileSitePickerStore;
  appActions?: AppActions;
}

export const WrappedRoutes = withRouter((Routes as any));

@observer
export class App extends React.Component<Props> {
  async componentDidMount() {
    await this.props.appActions!.getSiteAndProfile();
  }

  render() {
    const {profileStore} = this.props;
    return profileStore!.profile ?
      (
        <div>
          <div id="classification-banner" style={{marginBottom: '7rem'}}>
            <StyledClassificationBanner classified={profileStore!.profile!.classified}/>
            <StyledAuthorizationBanner/>
          </div>
          <div>
            {
              profileStore!.profile!.siteId != null ?
                <WrappedRoutes/> :
                <StyledProfileSitePicker/>
            }
          </div>
        </div>
      ) : null;
  }
}

export const InjectedApp = inject(
    'profileStore',
    'appActions'
)(App);

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

export const StyledClassificationBanner = styled(ClassificationBanner)`
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
