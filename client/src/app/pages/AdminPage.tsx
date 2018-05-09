import * as React from 'react';
import { StyledTopBar } from '../../widgets/TopBar';
import { observer } from 'mobx-react';
import { StyledProfileList } from '../../admin/ProfileList';
import { inject } from 'mobx-react/custom';
import { AdminStore } from '../../admin/stores/AdminStore';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { WebRepositories } from '../../utils/Repositories';

interface Props {
  adminStore?: AdminStore;
  profileStore?: ProfileSitePickerStore;
}

@inject('adminStore', 'profileStore')
@observer
export class AdminPage extends React.Component<Props> {
  async componentDidMount() {
    const [profilesResp, rolesResp, sites, profile] = await Promise.all([
      WebRepositories.profileRepository.findAll(),
      WebRepositories.profileRepository.findAllRoles(),
      WebRepositories.siteRepository.findAll(),
      WebRepositories.profileRepository.findOne(),
    ]);
    this.props.adminStore!.hydrate(profilesResp, rolesResp);
    this.props.profileStore!.hydrate(sites, profile);
  }

  render() {
    return (
      <React.Fragment>
        <StyledTopBar/>
        <StyledProfileList/>
      </React.Fragment>
    );
  }
}