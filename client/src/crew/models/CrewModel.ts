import { MissionModel } from '../../mission/models/MissionModel';
import { CrewPositionModel } from './CrewPositionModel';
import { observable } from 'mobx';

export class CrewModel {
  @observable public crewPositions: CrewPositionModel[] = [];

  constructor(public id: number,
              public mission: MissionModel,
              crewPositions: CrewPositionModel[]) {
    this.crewPositions = crewPositions;
  }

  get hasCrewPositions() {
    return this.crewPositions.length !== 0;
  }
}