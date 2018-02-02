import AirmanQualificationModel from './AirmanQualificationModel';
import EventModel from '../../event/EventModel';
import AirmanCertificationModel from './AirmanCertificationModel';

export default class AirmanModel {
  static empty(): AirmanModel {
    return new AirmanModel(-1, -1, '', '', [], [], []);
  }

  constructor(public id: number,
              public flightId: number,
              public firstName: string,
              public lastName: string,
              public qualifications: AirmanQualificationModel[],
              public certifications: AirmanCertificationModel[],
              public events: EventModel[]) {
  }

  isEmpty() {
    return this.id === -1;
  }
}
