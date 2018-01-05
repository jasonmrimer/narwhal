import QualificationModel from '../../qualification/models/QualificationModel';
import UnitModel from '../../unit/models/UnitModel';
import CertificationModel from '../../certification/models/CertificationModel';
import CrewModel from '../../crew/model/CrewModel';

export default class AirmanModel {
  static empty(): AirmanModel {
    return new AirmanModel('', '', [], [], []);
  }

  constructor(public firstName: string,
              public lastName: string,
              public qualifications: QualificationModel[],
              public certifications: CertificationModel[],
              public crews: CrewModel[],
              public unit: UnitModel | null = null) {
  }
}
