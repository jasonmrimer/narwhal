import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { DashboardStore } from './stores/DashboardStore';
import { StyledMissionCardSection } from './MissionCardSection';
import { StyledMultiTypeahead } from '../widgets/inputs/MultiTypeahead';
import { StyledTextInput } from '../widgets/inputs/TextInput';
import { StyledSingleTypeahead } from '../widgets/inputs/SingleTypeahead';

interface Props {
  dashboardStore?: DashboardStore;
  className?: string;
}

@inject('dashboardStore')
@observer
export class Dashboard extends React.Component<Props> {
  async componentDidMount() {
    await this.props.dashboardStore!.performLoading(async () => await this.props.dashboardStore!.hydrate());
  }

  render() {
    const {dashboardStore, className} = this.props;
    const {
      setSelectedSite,
      selectedSiteOption,
      siteOptions,
      platformOptions,
      setSelectedPlatformOptions,
      selectedPlatformOptions,
      missions
    } = dashboardStore!;

    return (
      <div className={className}>
        <div className="filters">
          <div className="filter-container">
            <label>SITE</label>
            <br/>
            <StyledSingleTypeahead
              options={siteOptions}
              onChange={async (e) => {
                await dashboardStore!.performLoading(async () => {
                  await setSelectedSite(e === null ? null : Number(e.value));
                });
              }}
              className="site-filter"
              clearButton={false}
              placeholder="All Sites"
              selected={selectedSiteOption}
              filterBy={() => {
                return true;
              }}
            />
          </div>
          <div className="filter-container">
            <div className="platform-filter">
              <label>PLATFORM</label>
              <br/>
              <StyledMultiTypeahead
                options={platformOptions}
                onChange={setSelectedPlatformOptions}
                selected={selectedPlatformOptions}
                placeholder="Filter Platform"
                className={'platform-typeahead'}
              />
            </div>
          </div>
          <div className="filter-container">
            <div>
              <label>MISSION ID</label>
              <br/>
              <StyledTextInput
                value={dashboardStore!.atoMissionNumberFilter}
                name="mission-filter"
                placeholder="All Missions"
                onChange={(e) => dashboardStore!.handleFilterMission(e.target.value)}
                className="mission-filter"
              />
            </div>
          </div>
        </div>
        <div className="missions">
          {Object.keys(missions).map((key: string, index: number) => {
            return (
              <StyledMissionCardSection
                missions={missions[key]}
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
    align-items: flex-end;
  }
  
  .filter-container {
    width: 20%;
    margin-top: 0.7rem;
    padding: 0.5rem 0;
    min-width: 20%;
    margin-right: 1rem;
    
    label {
      font-size: 0.875rem;
      font-weight: 300;
      color: ${props => props.theme.purpleSteel};
    }
    
    .mission-filter {
      height: 37px;
    }
  }
  
  .missions {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;