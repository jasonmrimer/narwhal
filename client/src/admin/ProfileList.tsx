import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { AdminStore } from './stores/AdminStore';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { StyledSingleTypeahead } from '../widgets/inputs/SingleTypeahead';

interface Props {
  adminStore?: AdminStore;
  profileStore?: ProfileSitePickerStore;
  className?: string;
}

@observer
export class ProfileList extends React.Component<Props> {
  render() {
    const {profileStore, adminStore} = this.props;
    const {hasError, error, roleOptions, setProfileRole, profiles, performLoading, getSelectedRoleOption} = adminStore!;
    return (
      <div className={this.props.className}>
        {
          hasError &&
          <h1 className="error">
            {error!.message + ' because you are not an Admin.'}
          </h1>
        }
        {
          !this.props.adminStore!.hasError &&
          <div className="profile-table">
            <div
              className="profile-header"
            >
              <span>Name</span>
              <span>Site</span>
              <span>Role</span>
            </div>
            <div>
              {
                profiles.map((profile) => {
                  return (
                    <div
                      className="profile-row"
                      key={profile.id}
                    >
                      <span>{profile.username}</span>
                      <span>{profile.siteName}</span>
                      <StyledSingleTypeahead
                        options={roleOptions}
                        onChange={async (evt) => {
                          if (evt !== null) {
                            await performLoading(
                              async () => {
                                await setProfileRole(profile, Number(evt.value));
                              }
                            );
                          }
                        }}
                        clearButton={false}
                        className="role-selector"
                        selected={getSelectedRoleOption(profile.roleId)}
                        filterBy={() => true}
                        disabled={profile.id === profileStore!.profile!.id}
                      />
                    </div>
                  );
                })
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

export const StyledProfileList = inject('profileStore', 'adminStore')(styled(ProfileList)`
    width: 800px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10rem;
    
    .error {
      width: 100%;
      text-align: center;
      margin-top: 3rem;
    }
    
    .profile-table {
      border: 1px solid ${props => props.theme.graySteel};
    }
    
    .profile-row, .profile-header {
      padding: 1rem;
      
      & > span, & > .role-selector {
        width: 33%;
        display: inline-block;
       }
    }
    
    .profile-row {
      &:nth-child(odd) {
        background: ${props => props.theme.dark};
      }
  
      &:nth-child(even) {
        background: ${props => props.theme.light};
      }
    }
    
    .profile-header {
      background-color: ${props => props.theme.lightest};
    }
    
`);
