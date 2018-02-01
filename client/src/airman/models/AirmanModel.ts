import AirmanQualificationModel from './AirmanQualificationModel';
import CertificationModel from './CertificationModel';
import EventModel from '../../event/EventModel';

export default class AirmanModel {
  static empty(): AirmanModel {
    return new AirmanModel(-1, -1, '', '', [], [], []);
  }

  constructor(public id: number,
              public flightId: number,
              public firstName: string,
              public lastName: string,
              public qualifications: AirmanQualificationModel[],
              public certifications: CertificationModel[],
              public events: EventModel[]) {
  }

  isEmpty() {
    return this.id === -1;
  }
}
