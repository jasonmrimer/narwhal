import * as React from 'react';
import { StyledTopBar } from '../../widgets/TopBar';
import { observer } from 'mobx-react';
import { StyledProfileList } from '../../admin/ProfileList';
import { inject } from 'mobx-react/custom';
import { AdminProfileStore } from '../../admin/stores/AdminProfileStore';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { WebRepositories } from '../../utils/Repositories';

interface Props {
  adminStore?: AdminProfileStore;
  profileStore?: ProfileSitePickerStore;
}

@inject('adminProfileStore', 'profileStore')
@observer
export class AdminPage extends React.Component<Props> {
  async componentDidMount() {
    await this.props.adminStore!.performLoading(async () => {
        const [profilesResp, rolesResp, sites, profile] = await Promise.all([
          WebRepositories.profileRepository.findAll(),
          WebRepositories.profileRepository.findAllRoles(),
          WebRepositories.siteRepository.findAll(),
          WebRepositories.profileRepository.findOne(),
        ]);
        this.props.adminStore!.hydrate(profilesResp, rolesResp);
        await this.props.profileStore!.hydrate(sites, profile);
      }
    );
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