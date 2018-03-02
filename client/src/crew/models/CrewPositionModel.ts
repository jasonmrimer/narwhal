import { AirmanModel } from '../../airman/models/AirmanModel';
import { observable } from 'mobx';

export class CrewPositionModel {
  @observable public title: string;
  @observable public critical: boolean;

  constructor(public airman: AirmanModel,
              title: string = '',
              critical: boolean = false,
              public id: number | null = null) {
    this.title = title;
    this.critical = critical;
  }

  get displayFullName() {
    return `${this.airman.lastName}, ${this.airman.firstName}`;
  }
}