import * as React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { inject, observer } from 'mobx-react';
import { Can } from '@casl/react';
import { TopBarActions } from './TopBarActions';
import { ProfileIcon } from '../icons/ProfileIcon';
import { PendingEventStore } from './stores/PendingEventStore';
import { StyledPendingEventTileList } from './PendingEventTileList';

interface Props {
  profileStore?: ProfileSitePickerStore;
  pendingEventStore?: PendingEventStore;
  topBarActions?: TopBarActions;
  history?: any;
  className?: string;
}

@observer
export class TopBar extends React.Component<Props> {
  render() {
    const {profileStore, topBarActions, pendingEventStore} = this.props;
    return (
      <React.Fragment>
        <div className={this.props.className}>
          <span className="logo">
            <img src="/sally.png"/>
            <span id="site-Title">Narwhal</span>
          </span>
          <span className="navigation-tabs">
            <Can do="read" on="mission" ability={profileStore!.profile!.ability!}>
              <NavLink
                to="/dashboard"
                activeClassName="selected"
                className="tab"
              >

                MISSION
              </NavLink>
            </Can>
            <NavLink
              to="/"
              exact={true}
              activeClassName="selected"
              className="tab"
            >
              AVAILABILITY
            </NavLink>
            <Can do="read" on="flight" ability={profileStore!.profile!.ability!}>
              <NavLink
                to="/flights"
                activeClassName="selected"
                className="tab"
              >
              FLIGHTS
              </NavLink>
            </Can>
          </span>
          <div className="requests">
            {
              profileStore!.hasPendingRequests &&
              <div className="requests-button" onClick={topBarActions!.getPendingRequests}>
                Requests Pending
              </div>
            }
            {
              pendingEventStore!.showList &&
              <StyledPendingEventTileList history={this.props.history}/>
            }
          </div>
          <div className="profile">
            <div className="profile-button">
            <span className="name">
              {`${profileStore!.profile!.username} (${profileStore!.profile!.roleName})`}
            </span>
              <span className="icon">
              <ProfileIcon/>
            </span>
            </div>
            <div className="profile-content">
              <a onClick={() => profileStore!.performLoading(topBarActions!.resetProfile)}>Reset Profile</a>
            </div>
          </div>
        </div>
        <TopBarSpacer/>
      </React.Fragment>
    );
  }
}

const TopBarSpacer = styled('div')`
  margin-bottom: 9rem;
`;

export const StyledTopBar = inject(
  'profileStore',
  'topBarActions',
  'pendingEventStore'
)(styled(TopBar)`
  border-collapse: collapse;
  
  background-color: ${props => props.theme.lighter};
  border-bottom: 2px solid ${props => props.theme.yellow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  font-weight: 100;
  
  position: fixed;
  top: 3rem;
  
  width:100%;
  height: 4rem;
  
  z-index: 1000;
  
  #site-Title {
    font-size: 1.75rem;
    font-weight: 400;
    color: ${props => props.theme.purpleSteel};
  }
   
  .logo {
    display: flex;
    align-items: center;
  }
  
  .navigation-tabs {
    display: flex;
    flex-direction: row;
    height: 100%;
    padding-top: calc(1rem - 2px);
    position: relative;
    top: 2px;
     
    a {
      border-bottom: none;
      text-decoration: none;
    }
    
    a.selected {
      border-bottom: 2px solid ${props => props.theme.dark};
      border-top: 2px solid ${props => props.theme.yellow};
      border-left: 2px solid ${props => props.theme.yellow};
      border-right: 2px solid ${props => props.theme.yellow};
      background-color: ${props => props.theme.dark};
      border-radius: 0.25rem 0.25rem 0 0;  
      color: ${props => props.theme.yellow};
    }  
  }
  
  span:first-child {
    font-size: 1.25rem;
  }
  
  span:last-child {
    font-size: 1rem;
  }
  
  span:first-child.logo {
    margin-left: 1.5rem;
  }
  
  span:last-child.logo {
    margin-left: 1rem;
  }

  .tab {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 1rem 0.6875rem 1rem;
    color: ${props => props.theme.fontColor};
    cursor: pointer;
    width: 12rem;
  }
  
  @media print {
    display: none;
  }
  
  .profile span {
    margin-right: 0.5rem;
  }
  
  .profile-button {
    border: none;
    padding: 2rem 0;
  }
  
  .profile, requests {
    position: relative;
    display: inline-block;
  }
  
  .requests-button {
    background-color: ${props => props.theme.yellow};
    border-radius: 0.5rem;
    color: ${props => props.theme.darkest};
    font-weight: 500;
    padding: 0.25rem;
    cursor: pointer;
  }
  
  .profile-content {
    display: none;
    position: absolute;
    background-color: ${props => props.theme.darker};
    border: 1px solid ${props => props.theme.fontColor};
    min-width: 4rem;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  
  .profile-content a {
    color: ${props => props.theme.fontColor};
    padding: 0.75rem 1rem;
    text-decoration: none;
    display: block;
  }
    
  .profile:hover .profile-content {
    display: block;
  }
`);