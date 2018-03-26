import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { DashboardStore } from './stores/DashboardStore';
import { TopLevelFilter } from '../widgets/Filter';
import * as moment from 'moment';
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
    const {missions} = this.props.dashboardStore;
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
            <StyledMissionCardSection
              missions={missions}
              header={'NEXT 24 HOURS'}
              intervalStart={moment()}
              intervalEnd={moment().add(24, 'hours')}
              className="next-24"
            />
            <StyledMissionCardSection
              missions={missions}
              header={'NEXT 72 HOURS'}
              intervalStart={moment().add(24, 'hours')}
              intervalEnd={moment().add(24 * 3, 'hours')}
              className="next-72"
            />
            <StyledMissionCardSection
              missions={missions}
              header={'THIS WEEK'}
              intervalStart={moment().add(24 * 3, 'hours')}
              intervalEnd={moment().add(24 * 7, 'hours')}
              className="this-week"
            />
            <StyledMissionCardSection
              missions={missions}
              header={'NEXT WEEK'}
              intervalStart={moment().add(24 * 7, 'hours')}
              intervalEnd={moment().add(24 * 14, 'hours')}
              className="next-week"
            />
            <StyledMissionCardSection
              missions={missions}
              header={'LONG RANGE'}
              intervalStart={moment().add(24 * 14, 'hours')}
              intervalEnd={moment().add(24 * 30, 'hours')}
              className="long-range"
            />
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