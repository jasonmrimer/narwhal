import * as React from 'react';
import { MissionModel } from '../mission/models/MissionModel';
import Mission from '../mission/Mission';
import styled from 'styled-components';
import TopBar from '../widgets/TopBar';
import { TopLevelFilter } from '../widgets/Filter';
import {default as createDefaultOption, DefaultValue } from '../utils/createDefaultOption';
import { SiteStore } from '../site/SiteStore';
import { observer } from 'mobx-react';
import { MissionStore } from '../mission/MissionStore';

interface Props {
  siteStore: SiteStore;
  missionStore: MissionStore;
  username: string;
  className?: string;
}

@observer
export class Dashboard extends React.Component<Props> {
  readonly unfilteredSiteOption: DefaultValue = createDefaultOption('All Sites');

  async componentDidMount() {
    this.props.siteStore.fetchAllSites();
    this.props.missionStore.fetchAllMissions();
  }

  render() {
    return (
      [
        <TopBar key="0" username={this.props.username} pageTitle="MPS DASHBOARD"/>,
        (
          <div key="1" className={`${this.props.className} filter`}>
            <div className="filter">
              <TopLevelFilter
                id="site-filter"
                store={this.props.siteStore}
                unfilteredOption={this.unfilteredSiteOption}
                callback={this.props.missionStore.fetchBySiteId}
                label={'SITE'}
              />
            </div>
          </div>),
        (
          <div key="2" className={`${this.props.className} missions`}>
            {this.props.missionStore.missions.map((mission: MissionModel, index) => {
              return <Mission mission={mission} key={index}/>;
            })}
          </div>)
      ]
    );
  }
}

export default styled(Dashboard)`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .filter {
    min-width: 40%;
    padding-left: calc(1% / 1);
    padding-top: 0.75rem;
    padding-bottom: 2.5rem;
  }
`;