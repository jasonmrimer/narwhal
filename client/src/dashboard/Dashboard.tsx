import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { DashboardStore } from './stores/DashboardStore';
import { TopLevelFilter } from '../widgets/Filter';
import { StyledMissionCardSection } from './MissionCardSection';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';

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
    const {dashboardStore, className} = this.props;
    return (
      <div>
        {dashboardStore.loading && <StyledLoadingOverlay/>}
        <div className={`${className} filter`}>
          <div className="filter">
            <TopLevelFilter
              id="site-filter"
              label="SITE"
              unfilteredOptionLabel="All Sites"
              value={dashboardStore.siteId}
              callback={dashboardStore.setSiteId}
              options={dashboardStore.siteOptions}
            />
          </div>
        </div>
        <div className={`${className} missions`}>
          {Object.keys(dashboardStore.missions).map((key: string, index: number) => {
            return (
              <StyledMissionCardSection
                missions={dashboardStore.missions[key]}
                header={key}
                className={key}
                key={index}
              />
            );
          })}
        </div>
      </div>
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