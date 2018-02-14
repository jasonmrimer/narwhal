import { Moment } from 'moment';
import { QualificationModel } from './QualificationModel';
import { CertificationModel } from './CertificationModel';
import { AirmanQualificationModel } from '../../airman/models/AirmanQualificationModel';
import { AirmanCertificationModel } from '../../airman/models/AirmanCertificationModel';
import { Skill } from './Skill';

export class SkillBuilder {
  private _id?: number;
  private _airmanId: number;
  private _earnDate: Moment;
  private _expirationDate: Moment;
  private _skill: QualificationModel | CertificationModel;

  setId(id: number | undefined) {
    this._id = id;
    return this;
  }

  setAirmanId(airmanId: number) {
    this._airmanId = airmanId;
    return this;
  }

  setEarnDate(earnDate: Moment) {
    this._earnDate = earnDate;
    return this;
  }

  setExpirationDate(expirationDate: Moment) {
    this._expirationDate = expirationDate;
    return this;
  }

  setSkill(skill: QualificationModel | CertificationModel) {
    this._skill = skill;
    return this;
  }

  build(): Skill {
    if (this._skill instanceof QualificationModel) {
      return new AirmanQualificationModel(
        this._airmanId,
        this._skill,
        this._earnDate,
        this._expirationDate,
        this._id
      );
    } else {
      return new AirmanCertificationModel(
        this._airmanId,
        this._skill,
        this._earnDate,
        this._expirationDate,
        this._id
      );
    }
  }
}