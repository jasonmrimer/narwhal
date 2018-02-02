import { Moment } from 'moment';
import QualificationModel from '../../skills/models/QualificationModel';

export default class AirmanQualificationModel {
  constructor(public airmanId: number,
              public qualification: QualificationModel,
              public earnDate: Moment,
              public expirationDate: Moment,
              public id?: number) {
  }

  get acronym() {
    return this.qualification.acronym;
  }

  get title() {
    return this.qualification.title;
  }
}
