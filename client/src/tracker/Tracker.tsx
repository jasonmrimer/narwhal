import * as React from 'react';
import Roster from '../roster/Roster';
import styled from 'styled-components';
import PlannerService from './services/PlannerService';
import TopBar from '../widgets/TopBar';
import { observer } from 'mobx-react';
import TrackerStore from './stores/TrackerStore';
import { TopLevelFilter } from '../widgets/Filter';
import SidePanel from './SidePanel/SidePanel';

interface Props {
  plannerService: PlannerService;
  trackerStore: TrackerStore;
  username: string;
  className?: string;
}

@observer
export class Tracker extends React.Component<Props> {
  componentDidMount() {
    this.props.trackerStore.hydrate();
  }

  render() {
    const {username, className, plannerService} = this.props;
    return (
      [
        <TopBar key="0" username={username} pageTitle="AVAILABILITY ROSTER"/>,
        (
          <div key="1" className={className}>
            <div className="main">
              <TopLevelFilter
                id="site-filter"
                label="SITE"
                unfilteredOptionLabel="All Sites"
                value={this.props.trackerStore.siteId}
                callback={this.props.trackerStore.setSiteId}
                options={this.props.trackerStore.siteOptions}
              />
              <TopLevelFilter
                id="squadron-filter"
                label="SQUADRON"
                unfilteredOptionLabel="All Squadrons"
                value={this.props.trackerStore.squadronId}
                callback={this.props.trackerStore.setSquadronId}
                options={this.props.trackerStore.squadronOptions}
              />
              <TopLevelFilter
                id="flight-filter"
                label="FLIGHT"
                unfilteredOptionLabel="All Flights"
                value={this.props.trackerStore.flightId}
                callback={this.props.trackerStore.setFlightId}
                options={this.props.trackerStore.flightOptions}
              />
              <div style={{display: 'flex'}}>
                <span style={{marginLeft: 'auto', fontSize: '0.75rem'}}>Empty = Available, Filled = Unavailable</span>
              </div>
              <div style={{display: 'flex'}}>
                <Roster
                  week={plannerService.getCurrentWeek()}
                  trackerStore={this.props.trackerStore}
                />
              </div>
            </div>
            {
              !this.props.trackerStore.selectedAirman.isEmpty()
                ? <SidePanel
                  trackerStore={this.props.trackerStore}
                />
                : null
            }
          </div>
        )]
    );
  }
}

export default styled(Tracker)`
  width: 75%;
  margin: 0 auto;
  padding: 0.5rem;
  display: flex;
  color: white;
 
  .main {
    width: 100%;
  }
 `;