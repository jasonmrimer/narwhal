import * as React from 'react';
import Roster from '../roster/Roster';
import { TopLevelFilter } from '../widgets/Filter';
import styled from 'styled-components';
import SidePanel from './SidePanel/SidePanel';
import PlannerService from './services/PlannerService';
import TopBar from '../widgets/TopBar';
import createDefaultOption, { DefaultValue } from '../utils/createDefaultOption';
import { observer } from 'mobx-react';
import { SquadronStore } from '../squadron/SquadronStore';
import { AirmanStore } from '../airman/AirmanStore';
import { CertificationStore } from '../airman/CertificationStore';
import { FlightStore } from '../flight/FlightStore';
import EventModel from '../event/EventModel';
import EventRepository from '../event/repositories/EventRepository';

interface Props {
  eventRepository: EventRepository;
  plannerService: PlannerService;
  username: string;
  squadronStore: SquadronStore;
  flightStore: FlightStore;
  airmanStore: AirmanStore;
  certificationStore: CertificationStore;
  className?: string;
}

@observer
export class Tracker extends React.Component<Props> {
  readonly unfilteredSquadronOption: DefaultValue = createDefaultOption('All Squadrons');
  readonly unfilteredFlightOption: DefaultValue = createDefaultOption('All Flights');

  componentDidMount() {
    this.props.squadronStore.fetchAllSquadrons();
    this.props.airmanStore.fetchAllAirman();
    this.props.certificationStore.fetchAllCertifications();
  }

    submitEvent = async (event: EventModel) => {
        const savedEvent = await this.props.eventRepository.save(event);

        const airman = this.props.airmanStore.getSelectedAirman;
        if (airman.id === -1) {
            return;
        }

        airman.events.push(savedEvent);
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
                id="squadron-filter"
                unfilteredOption={this.unfilteredSquadronOption}
                callback={this.props.airmanStore.fetchBySquadronId}
                store={this.props.squadronStore}
                label="SQUADRON"
              />
              <TopLevelFilter
                id="flight-filter"
                unfilteredOption={this.unfilteredFlightOption}
                store={this.props.flightStore}
                callback={this.props.airmanStore.fetchByFlight}
                label="FLIGHT"
              />
              <div style={{display: 'flex'}}>
                <span style={{marginLeft: 'auto', fontSize: '0.75rem'}}>Empty = Available, Filled = Unavailable</span>
              </div>
              <div style={{display: 'flex'}}>
                <Roster
                  certifications={this.props.certificationStore.certifications}
                  week={plannerService.getCurrentWeek()}
                  selectedCertificationIds={this.props.certificationStore.selectedCertificationIds}
                  setSelectedCertifications={this.props.certificationStore.setCertificationIds}
                  airmanStore={this.props.airmanStore}
                />
              </div>
            </div>
            {
              this.props.airmanStore.isSelectedAirmanFilled
                ? <SidePanel
                  airmanStore={this.props.airmanStore}
                  week={plannerService.getCurrentWeek()}
                  submitEvent={this.submitEvent}
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