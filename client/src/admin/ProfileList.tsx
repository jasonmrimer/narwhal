import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { AdminProfileStore } from './stores/AdminProfileStore';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { StyledSingleTypeahead } from '../widgets/inputs/SingleTypeahead';

interface Props {
  adminProfileStore?: AdminProfileStore;
  profileStore?: ProfileSitePickerStore;
  className?: string;
}

@observer
export class ProfileList extends React.Component<Props> {
  render() {
    const {profileStore, adminProfileStore} = this.props;
    const {
      hasError,
      error,
      roleOptions,
      setProfileRole,
      profiles,
      performLoading,
      getSelectedRoleOption
    } = adminProfileStore!;
    return (
      <div className={this.props.className}>
        {
          hasError &&
          <h1 className="error">
            {error!.message + ' because you are not an Admin.'}
          </h1>
        }
        {
          !this.props.adminProfileStore!.hasError &&
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

export const StyledProfileList = inject('profileStore', 'adminProfileStore')(styled(ProfileList)`
    display: inline-block;
    float: left;
    width: 500px;
    margin-left: 10rem;
    .error {
      width: 100%;
      text-align: center;
      margin-top: 3rem;
    }
    
    .profile-table {
      border: 1px solid ${props => props.theme.graySteel};
      margin-bottom: 2rem;
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
