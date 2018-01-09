import * as React from 'react';
import AirmanRepository from '../airman/repositories/AirmanRepository';
import Roster from '../roster/Roster';
import { TopLevelFilter } from '../widgets/Filter';
import UnitRepository from '../unit/repositories/UnitRepository';
import UnitModel from '../unit/models/UnitModel';
import FilterOption from '../widgets/models/FilterOptionModel';
import styled from 'styled-components';
import AirmanModel from '../airman/models/AirmanModel';
import SideBar from './SidePanel/SidePanel';
import PlannerService from './services/PlannerService';
import TopBar from '../widgets/TopBar';
import createDefaultOption, { DefaultValue } from '../utils/createDefaultOption';
import FlightRepository from '../flight/repositories/FlightRepository';
import FlightModel from '../flight/model/FlightModel';

interface Props {
  airmanRepository: AirmanRepository;
  unitRepository: UnitRepository;
  plannerService: PlannerService;
  flightRepository: FlightRepository;
  username: string;
  className?: string;
}

interface State {
  airmen: AirmanModel[];
  units: UnitModel[];
  selectedAirman: AirmanModel;
  flights: FlightModel[];
  showSidePanel: boolean;
}

export class Tracker extends React.Component<Props, State> {
  readonly defaultUnitOption: DefaultValue = createDefaultOption('All Units');
  readonly defaultFlightOption: DefaultValue = createDefaultOption('All Flights');

  constructor(props: Props) {
    super(props);
    this.state = {
      airmen: [],
      units: [],
      flights: [],
      selectedAirman: AirmanModel.empty(),
      showSidePanel: false,
    };
  }

  async componentDidMount() {
    const airmen = await this.props.airmanRepository.findAll();
    const units = await this.props.unitRepository.findAll();
    const flights = await this.props.flightRepository.findAll();
    this.setState({airmen, units, flights});
  }

  setSelectedUnitId = async (option: FilterOption) => {
    const updatedRoster = (option.value === this.defaultUnitOption.value) ?
      await this.props.airmanRepository.findAll() :
      await this.props.airmanRepository.findByUnit(option.value);
    this.setState({airmen: updatedRoster});
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

  closeSidePanel = () => {
    this.setState({selectedAirman: AirmanModel.empty(), showSidePanel: false});
  }

  render() {
    const unitOptions = this.state.units.map((unit: UnitModel) => {
      return {value: unit.id, text: unit.name};
    });

    const flightOptions = this.state.flights.map((flight: FlightModel) => {
      return {value: flight.id, text: flight.name};
    });

    return (
      [
        <TopBar key="0" username={this.props.username} pageTitle="AVAILABILITY ROSTER"/>,
        (
          <div key="1" className={this.props.className}>
            <div className="main">
              <TopLevelFilter
                id="unit-filter"
                defaultOption={this.defaultUnitOption}
                options={unitOptions}
                callback={this.setSelectedUnitId}
                label="SQUADRON"
              />
              <TopLevelFilter
                id="flight-filter"
                defaultOption={this.defaultFlightOption}
                options={flightOptions}
                callback={this.setSelectedFlightId}
                label="FLIGHT"
              />
              <div style={{display: 'flex'}}>
                <span style={{marginLeft: 'auto', fontSize: '0.75rem'}}>White = Uncommitted, Blue = Committed</span>
              </div>
              <div style={{display: 'flex'}}>
                <Roster
                  airmen={this.state.airmen}
                  week={this.props.plannerService.getCurrentWeek()}
                  selectedAirmanId={this.state.selectedAirman.id}
                  selectAirman={this.setSelectedAirman}
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