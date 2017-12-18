import QualificationModel from '../../qualification/models/QualificationModel';
import UnitModel from '../../unit/models/UnitModel';
import CertificationModel from '../../certification/models/CertificationModel';

export default class AirmanModel {
  static empty(): AirmanModel {
    return new AirmanModel('', '', [], []);
  }

  constructor(public firstName: string,
              public lastName: string,
              public qualifications: QualificationModel[],
              public certifications: CertificationModel[],
              public unit?: UnitModel) {
  }
}
