import * as React from 'react';
import AirmanRepository from '../airman/repositories/AirmanRepository';
import Roster from '../roster/Roster';
import Filter from '../widgets/Filter';
import UnitRepository from '../unit/repositories/UnitRepository';
import UnitModel from '../unit/models/UnitModel';
import FilterOption from '../widgets/models/FilterOptionModel';
import styled from 'styled-components';
import AirmanModel from '../airman/models/AirmanModel';
import SideBar from './SidePanel';
import PlannerService from './services/PlannerService';
import TopBar from '../widgets/TopBar';
import CrewRepository from '../crew/repositories/CrewRepository';
import CrewModel from '../crew/model/CrewModel';
import createDefaultOption, { DefaultValue } from '../utils/createDefaultOption';

interface Props {
  airmanRepository: AirmanRepository;
  unitRepository: UnitRepository;
  plannerService: PlannerService;
  crewRepository: CrewRepository;
  username: string;
  className?: string;
}

interface State {
  airmen: AirmanModel[];
  units: UnitModel[];
  selectedAirman: AirmanModel;
  crews: CrewModel[];
  showSidePanel: boolean;
}

export class Tracker extends React.Component<Props, State> {
  readonly defaultUnitOption: DefaultValue = createDefaultOption('All Units');
  readonly defaultCrewOption: DefaultValue = createDefaultOption('All Crews');

  constructor(props: Props) {
    super(props);
    this.state = {
      airmen: [],
      units: [],
      crews: [],
      selectedAirman: AirmanModel.empty(),
      showSidePanel: false,
    };
  }

  async componentDidMount() {
    const airmen = await this.props.airmanRepository.findAll();
    const units = await this.props.unitRepository.findAll();
    const crews = await this.props.crewRepository.findAll();
    this.setState({airmen, units, crews});
  }

  setSelectedUnitId = async (option: FilterOption) => {
    const updatedRoster = (option.value === this.defaultUnitOption.value) ?
      await this.props.airmanRepository.findAll() :
      await this.props.airmanRepository.findByUnit(option.value);

    this.setState({airmen: updatedRoster});
  }

  setSelectedCrewId = async (option: FilterOption) => {
    const updatedRoster = (option.value === this.defaultCrewOption.value) ?
      await this.props.airmanRepository.findAll() :
      await this.props.airmanRepository.findByCrew(option.value);

    this.setState({airmen: updatedRoster});
  }

  handleSelectAirman = (airman: AirmanModel) => {
    this.setState({selectedAirman: airman});
    this.setState({showSidePanel: true});
  }

  handleSidePanelClose = () => {
    this.setState({showSidePanel: false});
  }

  render() {
    const unitOptions = this.state.units.map((unit: UnitModel) => {
      return {value: unit.id, text: unit.name};
    });

    const crewOptions = this.state.crews.map((crew: CrewModel) => {
      return {value: crew.id, text: crew.name};
    });

    return (
      [
        <TopBar key="0" username={this.props.username} pageTitle="AVAILABILITY ROSTER"/>,
        (
          <div key="1" className={this.props.className}>
            <div className="main">
              <Filter
                id="unit-filter"
                className="filter"
                defaultOption={this.defaultUnitOption}
                options={unitOptions}
                callback={this.setSelectedUnitId}
              />
              <Filter
                id="crew-filter"
                className="filter"
                defaultOption={this.defaultCrewOption}
                options={crewOptions}
                callback={this.setSelectedCrewId}
              />
              <div style={{display: 'flex'}}>
                <span style={{marginLeft: 'auto', fontSize: '0.75rem'}}>White = Uncommitted, Blue = Committed</span>
              </div>
              <div style={{display: 'flex'}}>
                <Roster
                  airmen={this.state.airmen}
                  week={this.props.plannerService.getCurrentWeek()}
                  selectAirman={this.handleSelectAirman}
                />
              </div>
            </div>
            {
              this.state.showSidePanel
                ? <SideBar
                  airman={this.state.selectedAirman}
                  closeCallback={this.handleSidePanelClose}
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
    width: 75%;
    margin-right: 2rem;
  }

  .filter {
    margin-right: 2rem;
  }
`;