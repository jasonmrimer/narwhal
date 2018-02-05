import { Moment } from 'moment';
import QualificationModel from './QualificationModel';
import CertificationModel from './CertificationModel';
import AirmanQualificationModel from '../../airman/models/AirmanQualificationModel';
import AirmanCertificationModel from '../../airman/models/AirmanCertificationModel';

export default class SkillBuilder {
  private _airmanId: number;
  private _earnDate: Moment;
  private _expirationDate: Moment;
  private _skill: QualificationModel | CertificationModel;

  set airmanId(airmanId: number) {
    this._airmanId = airmanId;
  }

  set earnDate(earnDate: Moment) {
    this._earnDate = earnDate;
  }

  set expirationDate(expirationDate: Moment) {
    this._expirationDate = expirationDate;
  }

  set skill(skill: QualificationModel | CertificationModel) {
    this._skill = skill;
  }

  build(): AirmanQualificationModel | AirmanCertificationModel {
    if (this._skill instanceof QualificationModel) {
      return new AirmanQualificationModel(
        this._airmanId,
        this._skill,
        this._earnDate,
        this._expirationDate
      );
    } else {
      return new AirmanCertificationModel(
        this._airmanId,
        this._skill,
        this._earnDate,
        this._expirationDate
      );
    }
  }
}