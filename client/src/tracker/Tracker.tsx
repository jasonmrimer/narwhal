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
  selectedCertificationIds: number[];
  showSidePanel: boolean;
}

export class Tracker extends React.Component<Props, State> {
  readonly defaultSquadronOption: DefaultValue = createDefaultOption('All Squadrons');
  readonly defaultFlightOption: DefaultValue = createDefaultOption('All Flights');

  constructor(props: Props) {
    super(props);
    this.state = {
      airmen: [],
      certifications: [],
      squadrons: [],
      selectedAirman: AirmanModel.empty(),
      selectedSquadronId: -1,
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
    const updatedRoster = (option.value === this.defaultSquadronOption.value) ?
      await this.props.airmanRepository.findAll() :
      await this.props.airmanRepository.findBySquadron(option.value);
    this.setState({airmen: updatedRoster, selectedSquadronId: option.value});
  }

  setSelectedFlightId = async (option: FilterOption) => {
    const updatedRoster = (option.value === this.defaultFlightOption.value) ?
      await this.props.airmanRepository.findAll() :
      await this.props.airmanRepository.findByFlight(option.value);
    this.setState({airmen: updatedRoster});
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
    const squadronOptions = this.state.squadrons.map((squadron: SquadronModel) => {
      return {value: squadron.id, label: squadron.name};
    });

    const [selectedSquadron] = this.state.squadrons.filter(squadron => squadron.id === this.state.selectedSquadronId);

    const flightOptions = selectedSquadron ? selectedSquadron.flights.map((flight) => {
      return {value: flight.id, label: flight.name};
    }) : null;

    let {airmen, selectedCertificationIds} = this.state;
    if (selectedCertificationIds.length > 0) {
      airmen = airmen.filter(airman => {
        return !selectedCertificationIds.some(val => airman.certifications.map(cert => cert.id).indexOf(val) === -1);
      });
    }

    return (
      [
        <TopBar key="0" username={this.props.username} pageTitle="AVAILABILITY ROSTER"/>,
        (
          <div key="1" className={this.props.className}>
            <div className="main">
              <TopLevelFilter
                id="squadron-filter"
                defaultOption={this.defaultSquadronOption}
                options={squadronOptions}
                callback={this.setSelectedSquadronId}
                label="SQUADRON"
              />
              <TopLevelFilter
                id="flight-filter"
                defaultOption={flightOptions ? this.defaultFlightOption : createDefaultOption('Select Squadron')}
                options={flightOptions}
                callback={this.setSelectedFlightId}
                label="FLIGHT"
              />
              <div style={{display: 'flex'}}>
                <span style={{marginLeft: 'auto', fontSize: '0.75rem'}}>White = Uncommitted, Blue = Committed</span>
              </div>
              <div style={{display: 'flex'}}>
                <Roster
                  airmen={airmen}
                  certifications={this.state.certifications}
                  week={this.props.plannerService.getCurrentWeek()}
                  selectedAirmanId={this.state.selectedAirman.id}
                  selectAirman={this.setSelectedAirman}
                  selectedCertificationIds={this.state.selectedCertificationIds}
                  setSelectedCertifications={this.setSelectedCertificationIds}
                />
              </div>
            </div>
            {
              this.state.showSidePanel
                ? <SideBar
                  airman={this.state.selectedAirman}
                  closeCallback={this.closeSidePanel}
                  week={this.props.plannerService.getCurrentWeek()}
                />
                : null
            }
          </div>
        )
      ]
    );
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