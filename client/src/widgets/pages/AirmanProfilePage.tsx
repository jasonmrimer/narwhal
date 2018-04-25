import * as React from 'react';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { StyledTopBar } from '../TopBar';
import { StyledAirmanProfileManager } from '../../site-manager/AirmanProfileManager';
import { WebRepositories } from '../../utils/Repositories';
import { AirmanProfileManagerStore } from '../../site-manager/stores/AirmanProfileManagerStore';
import { StyledLoadingOverlay } from '../LoadingOverlay';
import { observer } from 'mobx-react';

interface Props {
  airmanProfileManagerStore: AirmanProfileManagerStore;
  profile: ProfileModel;
  airmanId: number;
}

@observer
export class AirmanProfilePage extends React.Component<Props> {
  async componentDidMount() {
    this.props.airmanProfileManagerStore.setLoading(true);

    const {airmanId} = this.props;
    const [airman, sites, ripItems] = await Promise.all([
      WebRepositories.airmanRepository.findOne(airmanId),
      WebRepositories.siteRepository.findAll(),
      WebRepositories.ripItemRepository.findBySelectedAirman(airmanId)
    ]);
    this.props.airmanProfileManagerStore.hydrate(airman, sites, ripItems);

    this.props.airmanProfileManagerStore.setLoading(false);
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
        {
          this.props.airmanProfileManagerStore.loading &&
          <StyledLoadingOverlay/>
        }
      </React.Fragment>
    );
  }
}