import { MissionModel } from '../../mission/models/MissionModel';
import { CrewPositionModel } from './CrewPositionModel';
import { observable } from 'mobx';
import { AirmanModel } from '../../airman/models/AirmanModel';

export class CrewModel {
  @observable public crewPositions: CrewPositionModel[] = [];

  constructor(public id: number,
              public mission: MissionModel,
              crewPositions: CrewPositionModel[]) {
    this.crewPositions = crewPositions;
  }

  hasAirman(airman: AirmanModel) {
    return this.crewPositions.filter(cp => cp.airman.id === airman.id).length >= 1;
  }
}