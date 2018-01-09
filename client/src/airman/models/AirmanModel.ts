import QualificationModel from './QualificationModel';
import CertificationModel from './CertificationModel';

export default class AirmanModel {
  static empty(): AirmanModel {
    return new AirmanModel(-1, '', '', [], [], -1);
  }

  constructor(public id: number,
              public firstName: string,
              public lastName: string,
              public qualifications: QualificationModel[],
              public certifications: CertificationModel[],
              public flightId: number) {
  }
}
