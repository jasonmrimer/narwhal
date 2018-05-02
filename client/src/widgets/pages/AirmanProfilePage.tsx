import * as React from 'react';
import { StyledTopBar } from '../TopBar';
import { StyledAirmanProfileManager } from '../../site-manager/AirmanProfileManager';
import { WebRepositories } from '../../utils/Repositories';
import { AirmanProfileManagerStore } from '../../site-manager/stores/AirmanProfileManagerStore';
import { StyledLoadingOverlay } from '../LoadingOverlay';
import { observer, inject } from 'mobx-react';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { History } from 'history';

interface Props {
  airmanProfileManagerStore?: AirmanProfileManagerStore;
  history: History;
  airmanId?: number;
}

@inject('airmanProfileManagerStore')
@observer
export class AirmanProfilePage extends React.Component<Props> {
  async componentDidMount() {
    this.props.airmanProfileManagerStore!.setLoading(true);
    const [sites, schedules] = await Promise.all([
      WebRepositories.siteRepository.findAll(),
      WebRepositories.scheduleRepository.findAll()
    ]);

    const {airmanId} = this.props;
    if (airmanId) {
      const [airman, ripItems] = await Promise.all([
        WebRepositories.airmanRepository.findOne(airmanId),
        WebRepositories.ripItemRepository.findBySelectedAirman(airmanId),
      ]);
      this.props.airmanProfileManagerStore!.hydrate(airman, sites, schedules, ripItems);

      this.props.airmanProfileManagerStore!.setLoading(false);
    } else {
      this.props.airmanProfileManagerStore!.hydrate(AirmanModel.empty(), sites, schedules);
      this.props.airmanProfileManagerStore!.setLoading(false);
    }
  }

  render() {
    return (
      <React.Fragment>
        <StyledTopBar/>
        <StyledAirmanProfileManager history={this.props.history}/>
        {
          this.props.airmanProfileManagerStore!.loading &&
          <StyledLoadingOverlay/>
        }
      </React.Fragment>
    );
  }
}