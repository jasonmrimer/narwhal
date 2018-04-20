import * as React from 'react';
import styled from 'styled-components';
import { ProfileModel } from '../profile/models/ProfileModel';
import { observer } from 'mobx-react';
import { ErrorResponse } from '../utils/HTTPClient';
import { FilterOption } from '../widgets/models/FilterOptionModel';
import { StyledDropdown } from '../widgets/Dropdown';

export interface ProfileListStore {
  hydrate: () => Promise<void>;
  profiles: ProfileModel[];
  hasError: boolean;
  error: ErrorResponse | null;
  roleOptions: FilterOption[];
  setProfileRole: (profile: ProfileModel, roleId: number) => void;
}

interface Props {
  profile: ProfileModel;
  store: ProfileListStore;
  className?: string;
}

@observer
export class ProfileList extends React.Component<Props> {
  async componentDidMount() {
    await this.props.store.hydrate();
  }

  render() {
    return (
      <div className={this.props.className}>
        {
          this.props.store.hasError &&
          <h1 className="error">
            {this.props.store.error!.message + ' because you are not an Admin.'}
          </h1>
        }
        {
          !this.props.store.hasError &&
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
                this.props.store.profiles.map((profile) => {
                  return (
                    <div
                      className="profile-row"
                      key={profile.id}
                    >
                      <span>{profile.username}</span>
                      <span>{profile.siteName}</span>
                      <StyledDropdown
                        disabled={profile.id === this.props.profile.id}
                        name="roleId"
                        options={this.props.store.roleOptions}
                        value={profile.roleId}
                        onChange={(evt: any) => this.props.store.setProfileRole(profile, evt.target.value)}
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

export const StyledProfileList = styled(ProfileList)`
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
      
      & > span, & > select {
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
    
`;
