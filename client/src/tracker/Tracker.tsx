import * as React from 'react';
import AirmanRepository from '../airman/repositories/AirmanRepository';
import Roster from '../roster/Roster';
import Filter from './Filter';
import UnitRepository from '../unit/repositories/UnitRepository';
import UnitModel from '../unit/models/UnitModel';
import FilterOption from './models/FilterOption';
import styled from 'styled-components';
import AirmanModel from '../airman/models/AirmanModel';
import SideBar from '../SideBar';
import PlannerService from './services/PlannerService';
import TopBar from '../TopBar';

interface Props {
  airmanRepository: AirmanRepository;
  unitRepository: UnitRepository;
  plannerService: PlannerService;
  username: string;
  className?: string;
}

interface State {
  airmen: AirmanModel[];
  units: UnitModel[];
  selectedUnitId: number;
  selectedAirman: AirmanModel;
}

export const DefaultFilter = {
  value: -1,
  text: 'All Units'
};

export class Tracker extends React.Component<Props, State> {
  state = {
    airmen: [],
    units: [],
    selectedUnitId: DefaultFilter.value,
    selectedAirman: AirmanModel.empty(),
  };

  async componentDidMount() {
    const airmen = await this.props.airmanRepository.findAll();
    const units = await this.props.unitRepository.findAll();

    this.setState({airmen, units});
  }

  setSelectedUnitId = async (option: FilterOption) => {
    const updatedRoster = (option.value === DefaultFilter.value) ?
      await this.props.airmanRepository.findAll() :
      await this.props.airmanRepository.findByUnit(option.value);

    this.setState({selectedUnitId: option.value, airmen: updatedRoster});
  }

  handleSelectAirman = (airman: AirmanModel) => {
    this.setState({selectedAirman: airman});
  }

  render() {
    const options = this.state.units.map((unit: UnitModel) => {
      return {value: unit.id, text: unit.name};
    });
    return (
      [
        <TopBar key="0" username={this.props.username} pageTitle="AVAILABILITY ROSTER"/>,
        (
          <div key="1" className={this.props.className}>
            <div className="main">
              <Filter callback={this.setSelectedUnitId} options={[DefaultFilter, ...options]}/>
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
            <SideBar airman={this.state.selectedAirman}/>
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
`;