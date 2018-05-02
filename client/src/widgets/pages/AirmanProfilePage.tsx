import * as React from 'react';
import { StyledTopBar } from '../TopBar';
import { StyledAirmanProfileManager } from '../../site-manager/AirmanProfileManager';
import { WebRepositories } from '../../utils/Repositories';
import { AirmanProfileManagerStore } from '../../site-manager/stores/AirmanProfileManagerStore';
import { StyledLoadingOverlay } from '../LoadingOverlay';
import { observer, inject } from 'mobx-react';

interface Props {
  airmanProfileManagerStore?: AirmanProfileManagerStore;
  airmanId: number;
}

@inject('airmanProfileManagerStore')
@observer
export class AirmanProfilePage extends React.Component<Props> {
  async componentDidMount() {
    this.props.airmanProfileManagerStore!.setLoading(true);

    const {airmanId} = this.props;
    const [airman, sites, ripItems, schedules] = await Promise.all([
      WebRepositories.airmanRepository.findOne(airmanId),
      WebRepositories.siteRepository.findAll(),
      WebRepositories.ripItemRepository.findBySelectedAirman(airmanId),
      WebRepositories.scheduleRepository.findAll()
    ]);
    this.props.airmanProfileManagerStore!.hydrate(airman, sites, ripItems, schedules);

    this.props.airmanProfileManagerStore!.setLoading(false);
  }

  render() {
    return (
      <React.Fragment>
        <StyledTopBar/>
        <StyledAirmanProfileManager/>
        {
          this.props.airmanProfileManagerStore!.loading &&
          <StyledLoadingOverlay/>
        }
      </React.Fragment>
    );
  }
}