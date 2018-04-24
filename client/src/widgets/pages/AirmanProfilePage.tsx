import * as React from 'react';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { StyledTopBar } from '../TopBar';
import { StyledAirmanProfileManager } from '../../site-manager/AirmanProfileManager';
import { WebRepositories } from '../../utils/Repositories';
import { AirmanProfileManagerStore } from '../../site-manager/stores/AirmanProfileManagerStore';

interface Props {
  airmanProfileManagerStore: AirmanProfileManagerStore;
  profile: ProfileModel;
  airmanId: number;
}

export class AirmanProfilePage extends React.Component<Props> {

  async componentDidMount() {
    const {airmanId} = this.props;
    const [airman, sites, ripItems] = await Promise.all([
      WebRepositories.airmanRepository.findOne(airmanId),
      WebRepositories.siteRepository.findAll(),
      WebRepositories.ripItemRepository.findBySelectedAirman(airmanId)
    ]);
    this.props.airmanProfileManagerStore.hydrate(airman, sites, ripItems);
  }

  render() {
    return (
      <React.Fragment>
        <StyledTopBar
          profile={this.props.profile}
        />
        <StyledAirmanProfileManager
          store={this.props.airmanProfileManagerStore}
        />
      </React.Fragment>
    );
  }
}