import { AirmanModel } from '../../airman/models/AirmanModel';
import { observable } from 'mobx';

export class CrewPositionModel {
  @observable public title: string;
  @observable public critical: boolean;
  @observable public remarks: string;
  @observable public order: number;
  @observable public templateItemId: number | null ;

  constructor(public airman: AirmanModel | null = null,
              title: string = '',
              critical: boolean = false,
              public id: number | null = null,
              remarks: string = '',
              order: number = 0,
              templateItemId: number | null = null
              ) {
    this.title = title;
    this.critical = critical;
    this.remarks = remarks;
    this.order = order;
    this.templateItemId = templateItemId;
  }

  get displayFullName() {
    return (this.airman === null ||
      this.airman!.lastName === '' ||
      this.airman!.firstName === '') ?
      '' : `${this.airman!.lastName}, ${this.airman!.firstName}`;
  }
}