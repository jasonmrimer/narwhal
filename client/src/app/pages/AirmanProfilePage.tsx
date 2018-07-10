import * as React from 'react';
import { StyledTopBar } from '../../widgets/TopBar';
import { StyledAirmanProfileManager } from '../../site-manager/AirmanProfileManager';
import { WebRepositories } from '../../utils/Repositories';
import { AirmanProfileManagerStore } from '../../site-manager/stores/AirmanProfileManagerStore';
import { StyledLoadingOverlay } from '../../widgets/LoadingOverlay';
import { observer, inject } from 'mobx-react';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { History } from 'history';
import { SiteManagerStore } from '../../site-manager/stores/SiteManagerStore';

interface Props {
  airmanProfileManagerStore?: AirmanProfileManagerStore;
  siteManagerStore?: SiteManagerStore;
  history: History;
  airmanId?: number;
}

@inject('airmanProfileManagerStore', 'siteManagerStore')
@observer
export class AirmanProfilePage extends React.Component<Props> {
  async componentDidMount() {
    await this.props.airmanProfileManagerStore!.performLoading(async () => {
      const [sites, schedules, ranks] = await Promise.all([
        WebRepositories.siteRepository.findAll(),
        WebRepositories.scheduleRepository.findAll(),
        WebRepositories.rankRepository.findAll()
      ]);

      const {airmanId, airmanProfileManagerStore, siteManagerStore} = this.props;
      if (airmanId) {
        const [airman, ripItems] = await Promise.all([
          WebRepositories.airmanRepository.findOne(airmanId),
          WebRepositories.ripItemRepository.findBySelectedAirman(airmanId),
        ]);
        airmanProfileManagerStore!.hydrate(airman, sites, schedules, ranks, ripItems);
      } else if (siteManagerStore!.pendingOperatorFlightId) {
        airmanProfileManagerStore!.hydrate(siteManagerStore!.makePendingAirman(), sites, schedules, ranks);
        siteManagerStore!.setPendingOperatorFlightId(null);
      } else {
        airmanProfileManagerStore!.hydrate(AirmanModel.empty(), sites, schedules, ranks);
      }
    });
  }

  render() {
    const {history} = this.props;

    return (
      <React.Fragment>
        <StyledTopBar history={history}/>
        <StyledAirmanProfileManager history={history}/>
        {
          this.props.airmanProfileManagerStore!.loading &&
          <StyledLoadingOverlay/>
        }
      </React.Fragment>
    );
  }
}