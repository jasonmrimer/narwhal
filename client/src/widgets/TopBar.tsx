import * as React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { inject, observer } from 'mobx-react';
import { Can } from '@casl/react';

interface Props {
  profileStore?: ProfileSitePickerStore;
  className?: string;
}

@observer
export class TopBar extends React.Component<Props> {
  render() {
    const {profileStore} = this.props;
    return (
      <React.Fragment>
        <div className={this.props.className}>
          <span className="logo">
            <img src="/sally.png"/>
            <span>Narwhal</span>
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
            <NavLink
              to="/flights"
              activeClassName="selected"
              className="tab"
            >
            FLIGHTS
            </NavLink>
          </span>
          <span>
          {`${profileStore!.profile!.username} (${profileStore!.profile!.roleName})`}
          </span>
        </div>
        <TopBarSpacer/>
      </React.Fragment>
    );
  }
}

const TopBarSpacer = styled('div')`
  margin-bottom: 9rem;
`;

export const StyledTopBar = inject('profileStore')(styled(TopBar)`
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
    margin-left: 1.5rem;
  }
  
  span:last-child {
    font-size: 1rem;
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
`);