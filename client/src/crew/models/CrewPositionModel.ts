import { AirmanModel } from '../../airman/models/AirmanModel';
import { observable } from 'mobx';

export class CrewPositionModel {
  @observable public title: string;
  @observable public critical: boolean;
  @observable public remarks: string;

  constructor(public airman: AirmanModel,
              title: string = '',
              critical: boolean = false,
              public id: number | null = null,
              remarks: string = ''
              ) {
    this.title = title;
    this.critical = critical;
    this.remarks = remarks;
  }

  get displayFullName() {
    return (this.airman.lastName === '' && this.airman.firstName === '') ?
      '' : `${this.airman.lastName}, ${this.airman.firstName}`;
  }
}