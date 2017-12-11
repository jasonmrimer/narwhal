import * as React from 'react';
import RosterRepository from '../roster/repositories/RosterRepository';
import Roster from '../roster/Roster';
import RosterModel from '../roster/models/RosterModel';
import Filter from './Filter';
import UnitRepository from './respositories/UnitRepository';
import UnitModel from './models/UnitModel';
import FilterOption from './models/FilterOption';
import styled from 'styled-components';

interface Props {
  rosterRepository: RosterRepository;
  unitRepository: UnitRepository;
  className?: string;
}

interface State {
  roster: RosterModel;
  units: UnitModel[];
  selectedUnitId: number;
}

export const DefaultFilter = {
  value: -1,
  text: 'All Units'
};

export class Tracker extends React.Component<Props, State> {
  state = {
    roster: new RosterModel(),
    units: [],
    selectedUnitId: DefaultFilter.value
  };

  async componentDidMount() {
    const roster = await this.props.rosterRepository.findOne();
    const units = await this.props.unitRepository.findAll();
    this.setState({roster, units});
  }

  setSelectedUnitId = async (option: FilterOption) => {
    const updatedRoster = (option.value === DefaultFilter.value) ?
      await this.props.rosterRepository.findOne() :
      await this.props.rosterRepository.findByUnit(option.value);

    this.setState({selectedUnitId: option.value, roster: updatedRoster});
  }

  render() {
    const options = this.state.units.map((unit: UnitModel) => {
      return {value: unit.id, text: unit.name};
    });
    return (
      <div className={this.props.className}>
        <Filter key="0" callback={this.setSelectedUnitId} options={[DefaultFilter, ...options]}/>
        <Roster key="1" roster={this.state.roster}/>
      </div>
    );
  }
}

export default styled(Tracker)`
  width: 75%;
  margin: 0 auto;
`;