import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { DashboardStore } from './stores/DashboardStore';
import { TopLevelFilter } from '../widgets/Filter';
import { StyledMissionCardSection } from './MissionCardSection';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { StyledMultiTypeahead } from '../widgets/MultiTypeahead';

interface Props {
  dashboardStore: DashboardStore;
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
      <div className={className}>
        {dashboardStore.loading && <StyledLoadingOverlay/>}
        <div className="filters">
          <TopLevelFilter
            id="site-filter"
            label="SITE"
            unfilteredOptionLabel="All Sites"
            value={dashboardStore.siteId}
            callback={dashboardStore.setSiteId}
            options={dashboardStore.siteOptions}
          />
          <div className="platform-filter">
            <label>PLATFORM</label>
            <br/>
            <StyledMultiTypeahead
              options={dashboardStore.platformOptions}
              onChange={dashboardStore.setSelectedPlatformOptions}
              selected={dashboardStore.selectedPlatformOptions}
              placeholder="Filter Platform"
              className={'platform-typeahead'}
            />
          </div>
        </div>
        <div className="missions">
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
  padding: 0.5rem;
  margin: 0 auto;
  width: 1200px;
  display: flex;
  flex-direction: column;
  
  .filters {
    display: flex;
  }
  
  .platform-filter {
    width: 20%;
    margin-left: 1rem;
    
    label {
      font-size: 0.875rem;
      font-weight: 300;
      color: ${props => props.theme.purpleSteel};
    }
   
    .platform-typeahead {
      margin-top: 0.7rem;
    } 
  }
  
  .missions {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;