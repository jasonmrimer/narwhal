import { AirmanModel } from '../../airman/models/AirmanModel';

export class CrewPositionModel {
  constructor(public id: number,
              public airman: AirmanModel,
              public title: string = '',
              public critical: boolean = false) {
  }
}