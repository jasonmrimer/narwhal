import * as React from 'react';
import { StyledTopBar } from '../../widgets/TopBar';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/custom';
import { AdminProfileStore } from '../../admin/stores/AdminProfileStore';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { WebRepositories } from '../../utils/Repositories';
import { AdminSquadronStore } from '../../admin/stores/AdminSquadronStore';
import { StyledAdminManager } from '../../admin/AdminManager';

interface Props {
  adminProfileStore?: AdminProfileStore;
  adminSquadronStore?: AdminSquadronStore;
  profileStore?: ProfileSitePickerStore;
}

@inject('adminProfileStore', 'adminSquadronStore', 'profileStore')
@observer
export class AdminPage extends React.Component<Props> {
  async componentDidMount() {
    const {profileRepository, siteRepository, adminSquadronRepository} = WebRepositories;
    const {adminProfileStore, adminSquadronStore, profileStore} = this.props;
    await this.props.adminProfileStore!.performLoading(async () => {
        const [profilesResp, rolesResp, sites, profile] = await Promise.all([
          profileRepository.findAll(),
          profileRepository.findAllRoles(),
          siteRepository.findAll(),
          profileRepository.findOne(),
        ]);
        adminProfileStore!.hydrate(profilesResp, rolesResp);
        await profileStore!.hydrate(sites, profile);
        if (adminProfileStore!.error === null) {
          const squads = await adminSquadronRepository.findAll();
          adminSquadronStore!.hydrate(squads);
        }
      }
    );
  }

  render() {
    return (
      <React.Fragment>
        <StyledTopBar/>
        <StyledAdminManager/>
      </React.Fragment>
    );
  }
}