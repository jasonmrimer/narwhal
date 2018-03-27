import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { DashboardStore } from './stores/DashboardStore';
import { TopLevelFilter } from '../widgets/Filter';
import { StyledMissionCardSection } from './MissionCardSection';

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
          <div key="0" className={`${this.props.className} filter`}>
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
          <div key="1" className={`${this.props.className} missions`}>
            {Object.keys(this.props.dashboardStore.missions).map((key: string, index: number) => {
              return (
                <StyledMissionCardSection
                  missions={this.props.dashboardStore.missions[key]}
                  header={key}
                  className={key}
                  key={index}
                />
              );
            })}
          </div>
        )
      ]
    );
  }
}

export const StyledDashboard = styled(Dashboard)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 1200px;
  margin: 0 auto;
  
  .filter {
    min-width: 40%;
    padding-top: 0.75rem;
    padding-bottom: 2.5rem;
  }
`;