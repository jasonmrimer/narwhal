import * as React from 'react';
import { StyledTopBar } from '../../widgets/TopBar';
import { StyledSiteManager } from '../../site-manager/SiteManager';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { inject, observer } from 'mobx-react';
import { Can } from '@casl/react';
import { Repositories } from '../../utils/Repositories';
import { SiteManagerStore } from '../../site-manager/stores/SiteManagerStore';

interface Props {
  profileStore?: ProfileSitePickerStore;
  siteManagerStore?: SiteManagerStore;
  repositories: Repositories;
}

@inject('profileStore', 'siteManagerStore')
@observer
export class FlightsPage extends React.Component<Props> {
  async componentDidMount() {
    await this.props.siteManagerStore!.performLoading(async () => {
      const profile = await this.props.repositories.profileRepository.findOne();
      const [site, airmen, certifications, schedules] = await Promise.all([
        this.props.repositories.siteRepository.findOne(profile!.siteId!),
        this.props.repositories.airmanRepository.findBySiteId(profile!.siteId!),
        this.props.repositories.certificationRepository.findAllCertificationsBySiteId(profile!.siteId!),
        this.props.repositories.scheduleRepository.findAll(),
      ]);
      this.props.siteManagerStore!.hydrate(profile, site.squadrons[0], airmen, certifications, schedules);
    });
  }

  render() {
    const {profileStore} = this.props;
    return (
      <React.Fragment>
        <StyledTopBar/>
        <Can do="read" on="mission" ability={profileStore!.profile!.ability!}>
          <StyledSiteManager/>
        </Can>
        <Can do="error" on="all" ability={profileStore!.profile!.ability!}>
          <h1 style={{textAlign: 'center'}}>You do not have access to this page.</h1>
        </Can>
      </React.Fragment>
    );
  }
}