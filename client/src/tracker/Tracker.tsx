import * as React from 'react';
import AirmanRepository from '../airman/repositories/AirmanRepository';
import Roster from '../roster/Roster';
import { TopLevelFilter } from '../widgets/Filter';
import SquadronRepository from '../squadron/repositories/SquadronRepository';
import SquadronModel from '../squadron/models/SquadronModel';
import FilterOption from '../widgets/models/FilterOptionModel';
import styled from 'styled-components';
import AirmanModel from '../airman/models/AirmanModel';
import SideBar from './SidePanel/SidePanel';
import PlannerService from './services/PlannerService';
import TopBar from '../widgets/TopBar';
import createDefaultOption, { DefaultValue } from '../utils/createDefaultOption';
import CertificationModel from '../airman/models/CertificationModel';
import CertificationRepository from '../airman/repositories/CertificationRepository';

interface Props {
  airmanRepository: AirmanRepository;
  certificationRepository: CertificationRepository;
  squadronRepository: SquadronRepository;
  plannerService: PlannerService;
  username: string;
  className?: string;
}

interface State {
  airmen: AirmanModel[];
  certifications: CertificationModel[];
  squadrons: SquadronModel[];
  selectedAirman: AirmanModel;
  selectedSquadronId: number;
  selectedFlightId: number;
  selectedCertificationIds: number[];
  showSidePanel: boolean;
}

export class Tracker extends React.Component<Props, State> {
  readonly unfilteredSquadronOption: DefaultValue = createDefaultOption('All Squadrons');
  readonly unfilteredFlightOption: DefaultValue = createDefaultOption('All Flights');

  constructor(props: Props) {
    super(props);
    this.state = {
      airmen: [],
      certifications: [],
      squadrons: [],
      selectedAirman: AirmanModel.empty(),
      selectedSquadronId: this.unfilteredSquadronOption.value,
      selectedFlightId: this.unfilteredFlightOption.value,
      selectedCertificationIds: [],
      showSidePanel: false,
    };
  }

  async componentDidMount() {
    const airmen = await this.props.airmanRepository.findAll();
    const certifications = await this.props.certificationRepository.findAll();
    const squadrons = await this.props.squadronRepository.findAll();
    this.setState({airmen, squadrons, certifications});
  }

  setSelectedSquadronId = async (option: FilterOption) => {
    const updatedRoster = (option.value === this.unfilteredSquadronOption.value) ?
      await this.props.airmanRepository.findAll() :
      await this.props.airmanRepository.findBySquadron(option.value);
    this.setState({
      airmen: updatedRoster,
      selectedSquadronId: option.value,
      selectedFlightId: this.unfilteredFlightOption.value
    });
  }

  setSelectedFlightId = async (option: FilterOption) => {
    const updatedRoster = (option.value === this.unfilteredFlightOption.value) ?
      await this.props.airmanRepository.findBySquadron(this.state.selectedSquadronId) :
      await this.props.airmanRepository.findByFlight(option.value);
    this.setState({
      airmen: updatedRoster,
      selectedFlightId: option.value
    });
  }

  setSelectedAirman = (airman: AirmanModel) => {
    this.setState({selectedAirman: airman, showSidePanel: true});
  }

  setSelectedCertificationIds = (options: FilterOption[]) => {
    this.setState({selectedCertificationIds: options.map(option => option.value)});
  }

  closeSidePanel = () => {
    this.setState({selectedAirman: AirmanModel.empty(), showSidePanel: false});
  }

  render() {
    const {username, className, plannerService} = this.props;
    const {
      selectedSquadronId,
      selectedFlightId,
      certifications,
      selectedAirman,
      showSidePanel,
      selectedCertificationIds
    } = this.state;

    const squadronOptions = this.getSquadronFilterOptions();
    const flightOptions = this.getFlightFilterOptions();
    const filteredAirmen = this.getFilteredAirmen();

    return (
      [
        <TopBar key="0" username={username} pageTitle="AVAILABILITY ROSTER"/>,
        (
          <div key="1" className={className}>
            <div className="main">
              <TopLevelFilter
                id="squadron-filter"
                value={selectedSquadronId}
                unfilteredOption={this.unfilteredSquadronOption}
                options={squadronOptions}
                callback={this.setSelectedSquadronId}
                label="SQUADRON"
              />
              <TopLevelFilter
                id="flight-filter"
                value={selectedFlightId}
                disabled={selectedSquadronId === this.unfilteredSquadronOption.value}
                unfilteredOption={this.unfilteredFlightOption}
                options={flightOptions}
                callback={this.setSelectedFlightId}
                label="FLIGHT"
              />
              <div style={{display: 'flex'}}>
                <span style={{marginLeft: 'auto', fontSize: '0.75rem'}}>Empty = Available, Filled = Unavailable</span>
              </div>
              <div style={{display: 'flex'}}>
                <Roster
                  airmen={filteredAirmen}
                  certifications={certifications}
                  week={plannerService.getCurrentWeek()}
                  selectedAirmanId={selectedAirman.id}
                  selectAirman={this.setSelectedAirman}
                  selectedCertificationIds={selectedCertificationIds}
                  setSelectedCertifications={this.setSelectedCertificationIds}
                />
              </div>
            </div>
            {
              showSidePanel
                ? <SideBar
                  airman={selectedAirman}
                  closeCallback={this.closeSidePanel}
                  week={plannerService.getCurrentWeek()}
                />
                : null
            }
          </div>
        )
      ]
    );
  }

  private getSquadronFilterOptions() {
    return this.state.squadrons.map((squadron: SquadronModel) => {
      return {value: squadron.id, label: squadron.name};
    });
  }

  private getFlightFilterOptions() {
    const {squadrons, selectedSquadronId} = this.state;
    const selectedSquadron = squadrons.find(squadron => squadron.id === selectedSquadronId);
    if (selectedSquadron) {
      return selectedSquadron.flights.map((flight) => ({value: flight.id, label: flight.name}));
    }
    return [];
  }

  private getFilteredAirmen() {
    const {airmen, selectedCertificationIds} = this.state;
    if (selectedCertificationIds.length > 0) {
      return airmen.filter(airman => {
        const airmanCertificationIds = airman.certifications.map(cert => cert.id);
        return !selectedCertificationIds.some(val => airmanCertificationIds.indexOf(val) === -1);
      });
    }
    return airmen;
  }
}

export default styled(Tracker)`
  width: 75%;
  margin: 0 auto;
  padding: 0.5rem;
  display: flex;
  
  .main {
    width: 100%;
  }
  `;