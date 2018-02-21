import * as React from 'react';
import { MissionModel } from '../mission/models/MissionModel';
import { StyledMission } from '../mission/Mission';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { DashboardStore } from './stores/DashboardStore';
import { TopLevelFilter } from '../widgets/Filter';

interface Props {
  dashboardStore: DashboardStore;
  username: string;
  className?: string;
}

@observer
export class Dashboard extends React.Component<Props> {
  async componentDidMount() {
    await this.props.dashboardStore.hydrate();
  }

  render() {
    return (
      [
        (
          <div key="1" className={`${this.props.className} filter`}>
            <div className="filter">
              <TopLevelFilter
                id="site-filter"
                label="SITE"
                unfilteredOptionLabel="All Sites"
                value={this.props.dashboardStore.siteId}
                callback={this.props.dashboardStore.setSiteId}
                options={this.props.dashboardStore.siteOptions}
              />
            </div>
          </div>
        ),
        (
          <div key="2" className={`${this.props.className} missions`}>
            {this.props.dashboardStore.missions.map((mission: MissionModel, index) => {
              return <StyledMission mission={mission} key={index}/>;
            })}
          </div>
        )
      ]
    );
  }
}

export const StyledDashboard = styled(Dashboard)`
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